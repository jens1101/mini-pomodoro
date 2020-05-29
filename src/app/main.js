import '../CountdownTimerElement.js'
import '../EditableListElement.js'

import {
  bootstrapLoadingPromise,
  bootstrapStyleSheet
} from '../lib/bootstrap.js'
import { DATABASE, EVENT_NAMES } from './constants.js'
import { db } from './database.js'

(async function init () {
  // Add Bootstrap to the main document as a style sheet.
  document.adoptedStyleSheets = [bootstrapStyleSheet]

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

  // Wait for all the setup to complete
  await Promise.all([
    bootstrapLoadingPromise,
    initCountdownTimer(countdownElement),
    initDistractionList(distractionsElement)
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
 * @returns {Promise<void>} Resolves once the list has been initialised.
 */
async function initDistractionList (distractionsElement) {
  // Setup the list item added event. Add the new list item to the DB.
  distractionsElement.addEventListener(EVENT_NAMES.LI_ADDED, updateDistraction,
    { passive: true })
  // Setup the list item removed event. Remove the list item from the DB.
  distractionsElement.addEventListener(EVENT_NAMES.LI_REMOVED, updateDistraction,
    { passive: true })

  // Get the distractions list items from the DB, populate the list, and add
  // all the distractions that were saved in the DB to the distractions list.
  const entry = await db
    .table(DATABASE.LIST_ITEMS.STORE)
    .get(distractionsElement.id)

  if (entry) distractionsElement.items = entry[DATABASE.LIST_ITEMS.ITEMS]
}

/**
 * Saves a distraction list to the database and resolves into the ID of the row
 * once the transaction is completed.
 * @param {event:EditableListItemAdded} event
 * @returns {Promise<string>}
 */
async function updateDistraction (event) {
  try {
    return db.table(DATABASE.LIST_ITEMS.STORE)
      .put({
        [DATABASE.LIST_ITEMS.ID]: event.detail.id,
        [DATABASE.LIST_ITEMS.ITEMS]: event.detail.currentItems
      })
  } catch (e) {
    /** @type {EditableListElement} */
    const distractionsElement = document.querySelector('#distractions')
    distractionsElement.items = event.detail.previousItems

    // TODO: display an error notification to the user
    console.error(e)
  }
}
