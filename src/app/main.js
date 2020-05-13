import '../countdown-timer/main.js'
import '../editable-list/main.js'
import { bootstrapLoadingPromise, bootstrapStyleSheet } from './bootstrap.js'
import { DATABASE } from './constants.js'
import { db } from './database.js'

(async function init () {
  document.adoptedStyleSheets = [bootstrapStyleSheet]

  /** @type {CountdownTimerElement} */
  const countdownElement = document.querySelector('#countdown')
  /** @type {EditableListElement} */
  const distractionsElement = document.querySelector('#distractions')

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
 * resumes the countdown timer (if applicable)
 * @param {CountdownTimerElement} countdownElement The countdown timer element
 * to initialise
 * @returns {Promise<void>} Resolves once the timer has been initialised.
 */
async function initCountdownTimer (countdownElement) {
  // Setup the countdown event listeners
  // When the countdown starts then save the start timestamp to the DB.
  countdownElement.addEventListener('countdownstart', saveCountdownTimestamp,
    { passive: true })

  // When the countdown was stopped by the user then remove the timestamp
  // from the DB
  countdownElement.addEventListener('countdownstop', deleteCountdownTimestamp,
    { passive: true })

  // When the countdown has completed successfully then show the notification
  // and then remove it from the DB.
  countdownElement.addEventListener('countdowncomplete', deleteCountdownTimestamp,
    { passive: true })

  // Get the countdown timer's value from the DB (if exists).
  const value = await db
    .table(DATABASE.COUNTDOWNS.STORE)
    .get(countdownElement.id)

  // If an object was associated with the current view's countdown timer then
  // resume the countdown from the timestamp stored in the object.
  if (value) countdownElement.resumeCountdown(value.startTimestamp)
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
    startTimestamp: event.detail.startTimestamp
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
  distractionsElement.addEventListener('liadded', updateDistraction,
    { passive: true })
  distractionsElement.addEventListener('liremoved', updateDistraction,
    { passive: true })

  // Get the distractions list's items from the DB and populate the list and
  // add all the distractions that were saved in the DB to the distractions
  // list.
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
