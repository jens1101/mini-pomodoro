/* globals Audio, customElements, Notification */

import {CountdownTimer} from './lib/countdown-timer/main.js'
import {EditableList} from './lib/editable-list/main.js'

const notificationSound = new Audio()

const countdown = document.getElementById('countdown')

init()

function init () {
  notificationSound.src = 'assets/audio/pomodoro-over.mp3'

  countdown.addEventListener('countdowncomplete', showNotification)

  customElements.define('countdown-timer', CountdownTimer)
  customElements.define('editable-list', EditableList)

  if (Notification.permission === 'default') {
    // Request notification permission if it hasn't been explicitly granted or
    // denied.
    Notification.requestPermission()
  }
}

function showNotification () {
  if (Notification.permission === 'granted') {
    new Notification('Time is up!')
  }
  notificationSound.play()
}
