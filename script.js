'use strict'

/* globals Audio, Notification */

// TODO: Maybe use local storage so that the pomodoro doesn't get lost when closing the tab.
// TODO: Add the ability to add distractions

let interval = null
const COUNTDOWN_SECONDS = 25 * 60 // 25 minutes
const notificationSound = new Audio()

const startPomodoroButton = document.querySelector('.start-pomodoro')
const stopPomodoroButton = document.querySelector('.stop-pomodoro')
const countdown = document.querySelector('.countdown')
const distractionForm = document.querySelector('.add-distraction')
const distractionsList = document.querySelector('.distractions')

init()

function init () {
  notificationSound.src = 'assets/audio/pomodoro-over.mp3'

  startPomodoroButton.addEventListener('click', startPomodoro)
  stopPomodoroButton.addEventListener('click', stopPomodoro)
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

function startPomodoro () {
  if (interval) {
    stopPomodoro()
  }

  let seconds = COUNTDOWN_SECONDS
  displayTime(seconds)

  interval = setInterval(() => {
    --seconds
    displayTime(seconds)

    if (seconds <= 0) {
      stopPomodoro()
      showNotification()
    }
  }, 1000)
}

function stopPomodoro () {
  clearInterval(interval)
  interval = null
  countdown.innerHTML = ''
}

function displayTime (seconds) {
  let minutes = Math.floor(seconds / 60)
  let _seconds = Math.floor(seconds % 60)

  if (minutes < 10) { minutes = `0${minutes}` }
  if (_seconds < 10) { _seconds = `0${_seconds}` }

  countdown.innerHTML = `${minutes}:${_seconds}`
}

function addDistraction (distraction) {
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
