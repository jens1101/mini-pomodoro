/* globals CustomEvent, HTMLElement */

import { ComponentHelper } from '../component-helper/main.js'
import { CountdownTimer } from './countdown-timer.js'

/**
 * Custom component which creates a countdown timer. The following attributes
 * are available:
 * `duration-ms` Optional. The number of milliseconds this countdown timer will
 * run for. If not specified then it will run for 25 minutes.
 * `start-text` Optional. The text to display on the start button. Defaults to
 * "Start".
 * `stop-text` Optional. The text to display on the stop button. Defaults to
 * "Stop".
 */
export class CountdownTimerElement extends HTMLElement {
  /**
   * @type {HTMLElement}
   */
  #timeDisplayElement

  /**
   * @type {HTMLElement}
   */
  #startCountdownElement

  /**
   * @type {HTMLElement}
   */
  #stopCountdownElement

  /**
   * @type {CountdownTimer}
   */
  #countdownTimer

  /**
   * This constructor sets up the contents of this component and initialises all
   * variables.
   */
  constructor () {
    super()

    this.#countdownTimer = new CountdownTimer()

    const templateUrl = new URL('./index.html', import.meta.url)
    this._setupPromise = ComponentHelper.initWithUrl(this, templateUrl)
      .then(() => {
        this.#timeDisplayElement = this.shadowRoot.getElementById('time-display')

        this.#startCountdownElement = this.shadowRoot.getElementById('start-countdown')
        this.#startCountdownElement.addEventListener('click', () => this.startCountdown())

        this.#stopCountdownElement = this.shadowRoot.getElementById('stop-countdown')
        this.#stopCountdownElement.addEventListener('click', () => this.stopCountdown())
      })
  }

  /**
   * Specifies the observed attributes so that `attributeChangedCallback` will
   * work
   * @return {string[]}
   */
  static get observedAttributes () {
    return ['duration-ms', 'start-text', 'stop-text']
  }

  /**
   * Lifecycle callback. Gets called whenever the component's HTML attributes
   * are changed.
   * @param {string} name The name of the attribute that has changed
   * @param {string} oldValue The previous value of the attribute
   * @param {string} newValue The new value of the attribute after the change
   */
  async attributeChangedCallback (name, oldValue, newValue) {
    // We need to wait for this component to finish setup, because we may need
    // to access elements of this component below.
    await this._setupPromise

    switch (name) {
      case 'duration-ms':
        if (isNaN(parseInt(newValue))) {
          this.#countdownTimer.durationMs = CountdownTimer.DEFAULT_DURATION_MS
        } else {
          this.#countdownTimer.durationMs = parseInt(newValue)
        }
        break
      case 'start-text':
        this.#startCountdownElement.textContent = newValue
        break
      case 'stop-text':
        this.#stopCountdownElement.textContent = newValue
        break
    }
  }

  /**
   * Dispatches the "countdownstart" event on this element. This is called when
   * the user starts the countdown timer. The start timestamp is sent as
   * additional details.
   * @param {number} startTimestamp The timestamp when the countdown timer
   * started.
   */
  #dispatchStartEvent = (startTimestamp) => {
    const event = new CustomEvent('countdownstart', {
      detail: { startTimestamp }
    })
    this.dispatchEvent(event)
  }

  /**
   * Dispatches the "countdowncomplete" event. This is called once this
   * countdown timer has completed.
   */
  #dispatchCompleteEvent = () => {
    this.dispatchEvent(new CustomEvent('countdowncomplete'))
  }

  /**
   * Displays the current countdown time in the element in the format:
   * "hh:mm:ss".
   * @param durationMs The number of milliseconds that are still left for this
   * countdown timer.
   */
  #displayTime = (durationMs) => {
    const durationSeconds = durationMs / 1000
    let seconds = Math.floor(durationSeconds % 60)

    let durationMinutes = durationSeconds / 60
    let minutes = Math.floor(durationMinutes % 60)

    let hours = Math.floor(minutes / 60)

    if (seconds < 10) { seconds = `0${seconds}` }
    if (minutes < 10) { minutes = `0${minutes}` }
    if (hours < 10) { hours = `0${hours}` }

    this.#timeDisplayElement.textContent = `${hours}:${minutes}:${seconds}`
  }

  /**
   * Starts the countdown. This first stops any existing countdown and then
   * stats it anew. This dispatches a custom event on this element called
   * "countdownstart".
   */
  startCountdown () {
    this.#countdownTimer.startCountdown(this.#dispatchStartEvent,
      this.#dispatchCompleteEvent, this.#displayTime)
  }

  /**
   * Stops the current countdown. This sets the timer back to zero and cancels
   * any existing timeout. This dispatches a custom event on this element
   * called "countdownstop".
   */
  stopCountdown () {
    this.#countdownTimer.stopCountdown()

    this.#displayTime(0)
    this.dispatchEvent(new CustomEvent('countdownstop'))
  }

  /**
   * Resumes the countdown using the given start timestamp. In effect this sets
   * the start timestamp and then starts the countdown, however no events will
   * be triggered.
   * @param {number} startTimestamp A Unix timestamp in milliseconds when this
   * timer was started.
   */
  resumeCountdown (startTimestamp) {
    this.#countdownTimer.resumeCountdown(startTimestamp,
      this.#dispatchCompleteEvent, this.#displayTime)
  }
}
