'use strict'

/* globals Audio, Notification */

// TODO: Maybe use local storage so that the pomodoro doesn't get lost when closing the tab.
// TODO: Add the ability to add distractions

let interval = null
const COUNTDOWN_SECONDS = 25 * 60 // 25 minutes
const notificationSound = new Audio()
notificationSound.src = 'https://www.myinstants.com/media/sounds/its-time-to-stop-button.mp3'

const startPomodoroButton = document.querySelector('.start-pomodoro')
const stopPomodoroButton = document.querySelector('.stop-pomodoro')
const countdown = document.querySelector('.countdown')
if (startPomodoroButton) {
  startPomodoroButton.addEventListener('click', startPomodoro)
}
if (stopPomodoroButton) {
  stopPomodoroButton.addEventListener('click', stopPomodoro)
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

function showNotification () {
  if (Notification.permission === 'granted') {
    Notification('Time is up!')
  }
  notificationSound.play()
}
