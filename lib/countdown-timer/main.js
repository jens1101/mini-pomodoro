/* globals HTMLElement, CustomEvent */

import {getTemplate} from '../jt-component/main.js'

export class CountdownTimer extends HTMLElement {
  // Specify observed attributes so that `attributeChangedCallback` will work
  static get observedAttributes () {
    return ['duration-ms', 'start-text', 'stop-text']
  }

  static get TICK_SIZE () { return 1000 }

  static get DEFAULT_DURATION_MS () { return 25 * 60 * 1000 /* 25 minutes */ }

  async connectedCallback () {
    this._currentTimeoutReference = null
    this._durationMs = CountdownTimer.DEFAULT_DURATION_MS
    const template = await getTemplate('./lib/countdown-timer/index.html')

    this._timeDisplayElement = template.element.getElementById('time-display')

    const startCountdownButton = template.element.getElementById('start-countdown')
    startCountdownButton.addEventListener('click', () => this.startCountdown())

    const stopCountdownButton = template.element.getElementById('stop-countdown')
    stopCountdownButton.addEventListener('click', () => this.stopCountdown())

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.element)
    shadowRoot.appendChild(template.stylesheet)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    // TODO: add cases for the start and stop button text
    switch (name) {
      case 'duration-ms':
        if (isNaN(newValue)) {
          this._durationMs = CountdownTimer.DEFAULT_DURATION_MS
        } else {
          this._durationMs = parseInt(newValue)
        }
    }
  }

  startCountdown () {
    if (this._currentTimeoutReference) {
      this.stopCountdown()
    }

    this._tick(Date.now(), 0)

    // TODO: add timestamp to this event
    const event = new CustomEvent('countdownstart')
    this.dispatchEvent(event)
  }

  stopCountdown () {
    clearTimeout(this._currentTimeoutReference)
    this._currentTimeoutReference = null
    this._displayTime(0)

    // TODO: add timestamp to this event
    const event = new CustomEvent('countdownstop')
    this.dispatchEvent(event)
  }

  _tick (startTimestamp, elapsedMs) {
    this._displayTime(this._durationMs - elapsedMs)

    if (elapsedMs >= this._durationMs) {
      this.dispatchEvent(new CustomEvent('countdowncomplete'))
      this.stopCountdown()
      return
    }

    const inaccuracy = (Date.now() - startTimestamp) - elapsedMs
    const nextTickSize = CountdownTimer.TICK_SIZE - inaccuracy
    this._currentTimeoutReference = setTimeout(this._tick.bind(this),
      nextTickSize,
      startTimestamp,
      elapsedMs + CountdownTimer.TICK_SIZE)
  }

  _displayTime (durationMs) {
    const durationSeconds = durationMs / 1000
    let seconds = Math.floor(durationSeconds % 60)

    let durationMinutes = durationSeconds / 60
    let minutes = Math.floor(durationMinutes % 60)

    let hours = Math.floor(minutes / 60)

    if (seconds < 10) { seconds = `0${seconds}` }
    if (minutes < 10) { minutes = `0${minutes}` }
    if (hours < 10) { hours = `0${hours}` }

    this._timeDisplayElement.textContent = `${hours}:${minutes}:${seconds}`
  }
}
