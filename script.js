/* globals Audio, customElements, Notification */

import {CountdownTimer} from './lib/countdown-timer/main.js'

// TODO: Maybe use local storage so that the pomodoro doesn't get lost when closing the tab.

const COUNTDOWN_SECONDS = 25 * 60 // 25 minutes
const notificationSound = new Audio()

const countdown = document.getElementById('countdown')

init()

function init () {
  notificationSound.src = 'assets/audio/pomodoro-over.mp3'

  countdown.setAttribute('duration', COUNTDOWN_SECONDS)
  countdown.addEventListener('countdowncomplete', showNotification)

  customElements.define('countdown-timer', CountdownTimer)

  if (Notification.permission === 'default') {
    // Request notification permission if it hasn't been explicitly granted or denied.
    Notification.requestPermission()
  }
}

function showNotification () {
  if (Notification.permission === 'granted') {
    new Notification('Time is up!')
  }
  notificationSound.play()
}
