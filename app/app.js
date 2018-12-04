/* globals Notification, Audio */

import { idb } from './idb.js'
import { dbUpgrade } from './db-upgrade.js'

export class App {
  constructor (countdownElement) {
    this.notificationSound = new Audio()
    this.notificationSound.src = 'assets/audio/pomodoro-over.mp3'

    this.countdown = countdownElement
    this.countdown.addEventListener('countdownstart',
      event => this.saveCountdownTimestamp(event))
    this.countdown.addEventListener('countdownstop',
      () => this.deleteCountdownTimestamp())
    this.countdown.addEventListener('countdowncomplete', () => {
      this.deleteCountdownTimestamp()
      this.showNotification()
    })

    if (Notification.permission === 'default') {
      // Request notification permission if it hasn't been explicitly granted or
      // denied.
      Notification.requestPermission()
    }

    this.dbPromise = idb.open('mini-pomodoro', 1, dbUpgrade)
      .then(db => { this.db = db })
      .then(() => {
        const tx = this.db.transaction('countdown-timers', 'readonly')
        return tx.objectStore('countdown-timers').get(this.countdown.id)
      })
      .then((value) => {
        if (value) {
          this.countdown.resumeCountdown(value.startTimestamp)
        }
      })
  }

  async saveCountdownTimestamp (event) {
    await this.dbPromise

    const tx = this.db.transaction('countdown-timers', 'readwrite')
    tx.objectStore('countdown-timers').put({
      id: this.countdown.id,
      startTimestamp: event.detail.startTimestamp
    })
    return tx.complete
  }

  async deleteCountdownTimestamp () {
    await this.dbPromise

    const tx = this.db.transaction('countdown-timers', 'readwrite')
    tx.objectStore('countdown-timers').delete(this.countdown.id)
    return tx.complete
  }

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
