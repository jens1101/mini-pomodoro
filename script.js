/* globals Audio, customElements, Notification */

import {CountdownTimer} from './lib/countdown-timer/main.js'

// TODO: Maybe use local storage so that the pomodoro doesn't get lost when closing the tab.

const COUNTDOWN_SECONDS = 25 * 60 // 25 minutes
const notificationSound = new Audio()

const countdown = document.getElementById('countdown')
const distractionForm = document.querySelector('.add-distraction')
const distractionsList = document.querySelector('.distractions')

init()

function init () {
  notificationSound.src = 'assets/audio/pomodoro-over.mp3'

  countdown.setAttribute('duration', COUNTDOWN_SECONDS)
  countdown.addEventListener('countdowncomplete', showNotification)

  customElements.define('countdown-timer', CountdownTimer)

  distractionForm.addEventListener('submit', function (event) {
    event.preventDefault()

    const inputElement = distractionForm.querySelector('input')
    addDistraction(inputElement.value)

    distractionForm.reset()
    inputElement.focus()
  })

  if (Notification.permission === 'default') {
    // Request notification permission if it hasn't been explicitly granted or denied.
    Notification.requestPermission()
  }
}

function addDistraction (distraction) {
  // TODO: add an auto-complete feature based on what you previously typed in here.
  const liElement = distractionsList
    .querySelector('.distraction-template')
    .content
    .firstElementChild
    .cloneNode(true)

  liElement.querySelector('span').appendChild(document.createTextNode(distraction))
  liElement.querySelector('button').addEventListener('click', () => liElement.remove())

  distractionsList.appendChild(liElement)
}

function showNotification () {
  if (Notification.permission === 'granted') {
    new Notification('Time is up!')
  }
  notificationSound.play()
}
