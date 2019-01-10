/* globals Notification, Audio */

import { dbUpgrade } from './db-upgrade.js'

export class App {
  constructor (countdownElement) {
    // Setup the notification sound for when the Pomodoro is done
    this.notificationSound = new Audio()
    this.notificationSound.src = 'assets/audio/pomodoro-over.mp3'

    if (Notification.permission === 'default') {
      // Request notification permission if it hasn't been explicitly granted or
      // denied.
      Notification.requestPermission()
    }

    // Setup all event listeners
    this.countdown = countdownElement
    this.countdown.addEventListener('countdownstart',
      event => this.saveCountdownTimestamp(event.detail.startTimestamp))
    this.countdown.addEventListener('countdownstop',
      () => this.deleteCountdownTimestamp())
    this.countdown.addEventListener('countdowncomplete', () => {
      this.deleteCountdownTimestamp()
      this.showNotification()
    })

    // Setup the Indexed DB
    this.dbPromise = new Promise((resolve, reject) => {
      // Open the DB and upgrade it if necessary

      const request = window.indexedDB.open('mini-pomodoro', 1)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
      request.onupgradeneeded = event => dbUpgrade(request.result,
        event.oldVersion)
    })
      .then(db => { this.db = db })
      .then(() => {
        // Get the object associated with the current view's countdown timer.

        return new Promise((resolve, reject) => {
          const tx = this.db.transaction('countdown-timers', 'readonly')
          tx.onerror = () => reject(tx.error)
          tx.onabort = () => reject(tx.error)

          const request = tx.objectStore('countdown-timers')
            .get(this.countdown.id)
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })
      })
      .then((value) => {
        if (value) {
          // If an object was associated with the current view's countdown timer
          // then resume the countdown from the timestamp stored in the object.
          this.countdown.resumeCountdown(value.startTimestamp)
        }
      })
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
        id: this.countdown.id,
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

      tx.objectStore('countdown-timers').delete(this.countdown.id)
      return tx.complete
    })
  }

  /**
   * Shows the "Time is up" notification to the user.
   */
  showNotification () {
    if (Notification.permission === 'granted') {
      // Creates a system notification that will be shown to the user to notify
      // him that the time is up.
      // The `no-new` ESLint rule is supressed because this syntax is required
      // for system notifications to work.
      new Notification('Time is up!') // eslint-disable-line no-new
    }
    this.notificationSound.play()
  }
}
