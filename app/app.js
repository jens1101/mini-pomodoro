/* globals Notification, Audio, IDBKeyRange */

import { dbUpgrade } from './db-upgrade.js'

/**
 * This is the main class for the application. This currently controls the
 * countdown timer and the list of distractions.
 */
export class App {
  /**
   * Initialises the countdown timer and the editable list of distractions.
   * @param {CountdownTimer} countdownElement The element that is the countdown
   * timer for this app.
   * @param {EditableList} distractionsElement The element that is the
   * editable list of distractions.
   */
  constructor (countdownElement, distractionsElement) {
    // Setup the notification sound for when the Pomodoro is done
    this.notificationSound = new Audio()
    this.notificationSound.src = 'assets/audio/pomodoro-over.mp3'

    if (Notification.permission === 'default') {
      // Request notification permission if it hasn't been explicitly granted
      // or denied.
      this.notificationPermission = Notification.requestPermission()
    } else {
      this.notificationPermission = Promise.resolve(Notification.permission)
    }

    // Setup the Indexed DB
    this.dbPromise = new Promise((resolve, reject) => {
      // Open the DB
      const request = window.indexedDB.open('mini-pomodoro', 2)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)

      // Upgrade the DB if necessary
      request.onupgradeneeded = event => dbUpgrade(request.result,
        event.oldVersion)
    }).then(db => { this.db = db })

    // Initialise the countdown timer
    this._initCountdownTimer(countdownElement)

    // Initialise the distraction list
    this._initDistractionList(distractionsElement)
  }

  /**
   * Initialise the countdown timer. This sets up all event handlers and
   * retrieves the timer's start timestamp from the DB (if any is available)
   * @param {CountdownTimer} countdownElement The countdown timer element to
   * initialise
   * @returns {Promise<void>} Resolves once the timer has been initialised.
   * @private
   */
  async _initCountdownTimer (countdownElement) {
    this.countdownElement = countdownElement

    // Setup the countdown event listeners
    // When the countdown starts then save the start timestamp to the DB.
    this.countdownElement.addEventListener('countdownstart',
      event => this.saveCountdownTimestamp(event.detail.startTimestamp))
    // When the countdown was stopped by the user then remove the timestamp
    // from the DB
    this.countdownElement.addEventListener('countdownstop',
      () => this.deleteCountdownTimestamp())
    // When the countdown has completed successfully then show the notification
    // and then remove it from the DB.
    this.countdownElement.addEventListener('countdowncomplete', async () => {
      await this.deleteCountdownTimestamp()
      await this.showNotification()
    })

    // Wait for the DB to be done setting up
    await this.dbPromise

    // Get the countdown timer's value from the DB. If a value is stored then
    // the countdown timer will be initialised with that value's start
    // timestamp.
    const value = await new Promise((resolve, reject) => {
      const tx = this.db.transaction('countdown-timers', 'readonly')
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)

      const request = tx.objectStore('countdown-timers')
        .get(this.countdownElement.id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    if (value) {
      // If an object was associated with the current view's countdown timer
      // then resume the countdown from the timestamp stored in the object.
      this.countdownElement.resumeCountdown(value.startTimestamp)
    }
  }

  /**
   * Initialise the distractions list. This sets up all event handlers and
   * retrieves the list's previously saved items from the DB (if any are
   * available)
   * @param {EditableList} distractionsElement The editable list element to
   * initialise as the distractions list.
   * @returns {Promise<void>} Resolves once the list has been initialised.
   * @private
   */
  async _initDistractionList (distractionsElement) {
    this.distractions = distractionsElement

    // Setup the distraction list event listeners
    // When a new list item has been added and it doesn't have an ID yet then
    // add it to the DB.
    this.distractions.addEventListener('liadded', async (event) => {
      const liElement = event.detail.liElement
      if (liElement.keyId == null) {
        liElement.keyId = await this.saveDistraction(liElement.text)
      }
    })
    // When a list item has been removed from the view then also remove it from
    // the DB.
    this.distractions.addEventListener('liremoved',
      event => this.deleteDistraction(event.detail.keyId))

    // Wait for the DB to be done setting up
    await this.dbPromise

    // Get the distractions list's items from the DB and populate the list
    const distractions = await new Promise((resolve, reject) => {
      const tx = this.db.transaction('editable-lists', 'readonly')
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)

      const results = []

      const index = tx.objectStore('editable-lists')
        .index('elementIdIndex')

      // The DB is structured in such a way that multiple editable lists' items
      // can be stored in the same table.
      // Here we need to open a cursor and iterate only over the list items
      // that belong to the distraction list.
      const request = index.openCursor(IDBKeyRange.only(this.distractions.id))

      request.onerror = () => reject(request.error)

      request.onsuccess = (event) => {
        // noinspection JSUnresolvedVariable
        const cursor = event.target.result

        if (cursor) {
          // We keep on pushing to the results array while the cursor contains
          // a value
          results.push(cursor.value)
          cursor.continue()
        } else {
          // Resolve the promise once we're done iterating.
          resolve(results)
        }
      }
    })

    // Add all the distractions that were saved in the DB to the distractions
    // list.
    for (const distraction of distractions) {
      this.distractions.addListItem(distraction.text, distraction.keyId)
    }
  }

  /**
   * Saves the given timestamp as the start timestamp for the current countdown
   * element in the current DB.
   * @param {number} startTimestamp
   */
  async saveCountdownTimestamp (startTimestamp) {
    await this.dbPromise

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('countdown-timers', 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)

      tx.objectStore('countdown-timers').put({
        id: this.countdownElement.id,
        startTimestamp: startTimestamp
      })
    })
  }

  /**
   * Deletes the object associated with the current countdown element, thus
   * removing it's start timestamp.
   */
  async deleteCountdownTimestamp () {
    await this.dbPromise

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('countdown-timers', 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)

      tx.objectStore('countdown-timers').delete(this.countdownElement.id)
    })
  }

  /**
   * Shows the "Time is up" notification to the user.
   */
  async showNotification () {
    if (await this.notificationPermission === 'granted') {
      // Creates a system notification that will be shown to the user to notify
      // him that the time is up.
      // The `no-new` ESLint rule is suppressed because this syntax is required
      // for system notifications to work.
      new Notification('Time is up!') // eslint-disable-line no-new
    }

    await this.notificationSound.play()
  }

  /**
   * Saves a distraction to the database and resolves into the ID of the row
   * once the transaction is complete.
   * @param {string} text The distraction
   * @returns {Promise<number>}
   */
  async saveDistraction (text) {
    await this.dbPromise

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('editable-lists', 'readwrite')
      tx.oncomplete = () => resolve(successPromise)
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)

      const request = tx.objectStore('editable-lists').add({
        elementId: this.distractions.id,
        text
      })

      const successPromise = new Promise(resolve => {
        request.onsuccess = event => resolve(event.target.result)
      })
    })
  }

  /**
   * Removes the distraction with the given key ID from the DB
   * @param {number} keyId The ID of the distraction to remove from the DB.
   * @returns {Promise<undefined>} Resolves once the operation is done.
   */
  async deleteDistraction (keyId) {
    await this.dbPromise

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('editable-lists', 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)

      tx.objectStore('editable-lists').delete(keyId)
    })
  }
}
