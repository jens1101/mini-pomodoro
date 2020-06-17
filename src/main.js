import { DATABASE, EVENT_NAMES } from './constants.js'
import './CountdownTimerElement.js'
import { db } from './database.js'
import './EditableListElement.js'
import { loadingPromise, styleSheet } from './styles.js'
import { TOAST_TYPES } from './ToastContainerElement.js'

(async function init () {
  // Add Bootstrap to the main document as a style sheet.
  document.adoptedStyleSheets = [styleSheet]

  /**
   * The countdown element used as the pomodoro timer.
   * @type {CountdownTimerElement}
   */
  const countdownElement = document.querySelector('#countdown')

  /**
   * The editable list used as the list of distractions by the app.
   * @type {EditableListElement}
   */
  const distractionsElement = document.querySelector('#distractions')

  /**
   * @type {ToastContainerElement}
   */
  const toastContainer = document.querySelector('#toasts')

  // Handle any unhandled DB errors
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason

    toastContainer.addToast({
      type: TOAST_TYPES.DANGER,
      headerText: 'A database error occurred',
      bodyText: error.message
    })
  })

  // Wait for all the setup to complete
  await Promise.all([
    loadingPromise,
    initCountdownTimer(countdownElement),
    initDistractionList(distractionsElement, toastContainer)
  ])

  // Only show the body contents once all setup has been completed
  document.body.removeAttribute('hidden')
})()

/**
 * Initialise the countdown timer. This sets up all event handlers and
 * resumes the countdown timer (if applicable).
 * @param {CountdownTimerElement} countdownElement The countdown timer element
 * to initialise
 * @returns {Promise<void>} Resolves once the timer has been initialised.
 */
async function initCountdownTimer (countdownElement) {
  // Setup the start countdown event. When the countdown starts then save the
  // start timestamp to the DB.
  countdownElement.addEventListener(EVENT_NAMES.COUNTDOWN_START,
    saveCountdownTimestamp, { passive: true })

  // Setup the end countdown event. When the countdown was stopped by the user
  // then remove the timestamp from the DB
  countdownElement.addEventListener(EVENT_NAMES.COUNTDOWN_STOP,
    deleteCountdownTimestamp, { passive: true })

  // Setup the countdown complete event. When the countdown has completed
  // successfully then show the notification and then remove it from the DB.
  countdownElement.addEventListener(EVENT_NAMES.COUNTDOWN_COMPLETE,
    deleteCountdownTimestamp, { passive: true })

  // Get the countdown timer's value from the DB (if exists).
  const entry = await db
    .table(DATABASE.COUNTDOWNS.STORE)
    .get(countdownElement.id)

  // If an object was associated with the current view's countdown timer then
  // resume the countdown from the timestamp stored in the object.
  if (entry) {
    countdownElement.resumeCountdown(entry[DATABASE.COUNTDOWNS.START_TIMESTAMP])
  }
}

/**
 * Saves the given timestamp as the start timestamp for the current countdown
 * element in the current DB.
 * @param {CustomEvent<{id: string, startTimestamp: number}>} event
 * @return {Promise<string>} Resolves into the ID of the countdown
 */
async function saveCountdownTimestamp (event) {
  return db.table(DATABASE.COUNTDOWNS.STORE).put({
    [DATABASE.COUNTDOWNS.ID]: event.detail.id,
    [DATABASE.COUNTDOWNS.START_TIMESTAMP]: event.detail.startTimestamp
  })
}

/**
 * Deletes the object associated with the current countdown element, thus
 * removing it's start timestamp.
 * @param {CustomEvent<{id: string}>} event
 */
async function deleteCountdownTimestamp (event) {
  return db.table(DATABASE.COUNTDOWNS.STORE).delete(event.detail.id)
}

/**
 * Initialise the distractions list. This sets up all event handlers and
 * retrieves the list's previously saved items from the DB.
 * @listens {event:EditableListItemAdded}
 * @listens {event:EditableListItemRemoved}
 * @param {EditableListElement} distractionsElement The editable list element to
 * initialise as the distractions list.
 * @param {ToastContainerElement} toastContainer The toast container to which
 * to add toasts when an error occurs.
 * @returns {Promise<void>} Resolves once the list has been initialised.
 */
async function initDistractionList (distractionsElement, toastContainer) {
  /**
   * Event handler for when distractions get added and deleted.
   * @param {event:EditableListItemAdded} event
   */
  const onListUpdate = async (event) => {
    try {
      await setListItems(event.detail.id, event.detail.currentItems)
    } catch (error) {
      // If the update failed then revert the UI to the previous state and show
      // an error toast.

      distractionsElement.items = event.detail.previousItems
      toastContainer.addToast({
        type: TOAST_TYPES.DANGER,
        headerText: 'Error updating distractions',
        bodyText: error.message
      })
    }
  }

  // Setup the list item added event. Add the new list item to the DB.
  distractionsElement.addEventListener(EVENT_NAMES.LI_ADDED, onListUpdate,
    { passive: true })
  // Setup the list item removed event. Remove the list item from the DB.
  distractionsElement.addEventListener(EVENT_NAMES.LI_REMOVED, onListUpdate,
    { passive: true })

  // Get the distractions list items from the DB, populate the list, and add
  // all the distractions that were saved in the DB to the distractions list.
  const entry = await db
    .table(DATABASE.LIST_ITEMS.STORE)
    .get(distractionsElement.id)

  if (entry) distractionsElement.items = entry[DATABASE.LIST_ITEMS.ITEMS]
}

/**
 * Updates the list with the specified ID. If the list doesn't exist in the
 * table then a new row is created instead.
 * @param {string} id The ID of the list
 * @param {EditableListItem[]} items The new array of items to update the
 * list to
 * @returns {Promise<string>} If the operation succeeds then resolves to the
 * key under which the list was stored in the table
 * @throws {DexieError} If the DB operation failed
 */
async function setListItems (id, items) {
  return db.table(DATABASE.LIST_ITEMS.STORE)
    .put({
      [DATABASE.LIST_ITEMS.ID]: id,
      [DATABASE.LIST_ITEMS.ITEMS]: items
    })
}
