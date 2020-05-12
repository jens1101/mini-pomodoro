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
  countdownElement.addEventListener('countdownstart', saveCountdownTimestamp)

  // When the countdown was stopped by the user then remove the timestamp
  // from the DB
  countdownElement.addEventListener('countdownstop', deleteCountdownTimestamp)

  // When the countdown has completed successfully then show the notification
  // and then remove it from the DB.
  countdownElement.addEventListener('countdowncomplete', deleteCountdownTimestamp)

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
 * @param {EditableListElement} distractionsElement The editable list element to
 * initialise as the distractions list.
 * @returns {Promise<void>} Resolves once the list has been initialised.
 */
async function initDistractionList (distractionsElement) {
  distractionsElement.addEventListener('liadded', saveDistraction,
    { passive: true })
  distractionsElement.addEventListener('liremoved', deleteDistraction,
    { passive: true })

  // Get the distractions list's items from the DB and populate the list and
  // add all the distractions that were saved in the DB to the distractions
  // list.
  distractionsElement.items = await db
    .table(DATABASE.LIST_ITEMS.STORE)
    .get({ [DATABASE.LIST_ITEMS.LIST_ID]: distractionsElement.id })
}

/**
 * Saves a distraction to the database and resolves into the ID of the row
 * once the transaction is complete.
 * @param {CustomEvent<{listId: string, text: string}>} event
 * @returns {Promise<number>}
 */
async function saveDistraction (event) {
  // TODO: add the distraction to the DB
  // TODO: after the item was successfully added then update the `items` property of the distraction list

  return db.table(DATABASE.LIST_ITEMS.STORE)
    .add({
      [DATABASE.LIST_ITEMS.LIST_ID]: event.detail.listId,
      [DATABASE.LIST_ITEMS.TEXT]: event.detail.text
    })
}

/**
 * Removes the distraction with the given key ID from the DB
 * @param {CustomEvent<{id: number}>} event
 * @returns {Promise<void>} Resolves once the operation is done.
 */
async function deleteDistraction (event) {
  return db.table(DATABASE.LIST_ITEMS.STORE).delete(event.detail.id)
}
