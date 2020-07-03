import { LitElement } from 'lit-element'
import { html } from 'lit-html'
import { EVENT_NAMES } from './constants.js'
import { CountdownTimer } from './CountdownTimer.js'
import { litCss } from './styles.js'

/**
 * An element that will countdown for the specified duration. Allows the user to
 * start and stop the countdown. Events are emitted for countdown start, stop,
 * and completion.
 */
export class CountdownTimerElement extends LitElement {
  constructor () {
    super()

    /**
     * The countdown timer that is responsible for the actual timer logic.
     * @type {CountdownTimer}
     * @private
     */
    this._countdownTimer = new CountdownTimer()

    /**
     * The duration in milliseconds of this countdown timer.
     * @type {number}
     * @private
     */
    this._totalDurationMs = this._countdownTimer.durationMs

    /**
     * The number of milliseconds that have passed since the countdown has been
     * started.
     * @type {number}
     */
    this.currentDurationMs = 0
  }

  static get properties () {
    return {
      totalDurationMs: { type: Number },
      currentDurationMs: { attribute: false }
    }
  }

  static get styles () {
    return litCss
  }

  /**
   * Gets the total number of milliseconds for which this timer will run.
   * @returns {number}
   */
  get totalDurationMs () {
    return this._totalDurationMs
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the total number of milliseconds for which this timer will run.
   * @param {number} newDuration The new duration for the timer. Must be a
   * positive integer.
   * @throws {TypeError} If the duration is not an integer
   * @throws {RangeError} If the duration is not a positive integer
   */
  set totalDurationMs (newDuration) {
    this._countdownTimer.durationMs = newDuration
    this._totalDurationMs = newDuration
  }

  /**
   * Converts the given number of milliseconds into a timer display string.
   * Hours, minutes, and seconds are separated by colons.
   * @nosideeffects
   * @param {number} durationMs The duration in milliseconds.
   * @return {string} A human readable string representing the specified
   * duration.
   */
  static durationToDisplayString (durationMs) {
    const durationSeconds = durationMs / 1000
    const seconds = `${Math.floor(durationSeconds % 60)}`.padStart(2, '0')

    const durationMinutes = durationSeconds / 60
    const minutes = `${Math.floor(durationMinutes % 60)}`.padStart(2, '0')

    const hours = `${Math.floor(minutes / 60)}`.padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  /**
   * This is called once this countdown timer has completed. Displays 00:00:00
   * for the countdown time and dispatches the "countdown-complete" event on
   * this element.
   * @private
   */
  _countdownComplete () {
    this.currentDurationMs = 0
    this.dispatchEvent(new window.CustomEvent(EVENT_NAMES.COUNTDOWN_COMPLETE, {
      detail: { id: this.id }
    }))
  }

  /**
   * Dispatches the "countdown-start" event on this element. This is called when
   * the user starts the countdown timer. The start timestamp and ID are sent as
   * additional details.
   * @private
   * @param {number} startTimestamp The timestamp when the countdown timer
   * started.
   */
  _dispatchStartEvent (startTimestamp) {
    const event = new window.CustomEvent(EVENT_NAMES.COUNTDOWN_START, {
      detail: { id: this.id, startTimestamp }
    })
    this.dispatchEvent(event)
  }

  render () {
    const durationString = CountdownTimerElement
      .durationToDisplayString(this.currentDurationMs)

    const progress = '' +
      Math.min(Math.max(this.currentDurationMs / this.totalDurationMs * 100, 0),
        100).toFixed(2) +
      '%'

    return html`
      <div class="card text-center bg-dark text-light">
        <div class="card-body">
          <p class="card-title display-2">${durationString}</p>
          <div class="progress">
            <div class="progress-bar"
                 style="width: ${progress}"></div>
          </div>
        </div>
        <div class="card-footer">
          <button @click="${this.startCountdown}"
                  class="btn btn-primary"
                  type="button"
                  ?disabled="${this._countdownTimer.isRunning}">
            <slot name="start-button">
              <span class="fas fa-play"></span>
            </slot>
          </button>
          <button @click="${this.stopCountdown}"
                  class="btn btn-primary"
                  type="button"
                  ?disabled="${!this._countdownTimer.isRunning}">
            <slot name="stop-button">
              <span class="fas fa-stop"></span>
            </slot>
          </button>
        </div>
      </div>`
  }

  /**
   * Resumes the countdown using the given start timestamp. In effect this sets
   * the start timestamp and then starts the countdown, however no events will
   * be triggered.
   * @param {number} startTimestamp A Unix timestamp in milliseconds when this
   * timer was started.
   */
  resumeCountdown (startTimestamp) {
    this._countdownTimer.resumeCountdown(startTimestamp,
      () => this._countdownComplete(),
      timeLeftMs => { this.currentDurationMs = timeLeftMs })
  }

  /**
   * Starts the countdown. This first stops any existing countdown and then
   * stats it anew. This dispatches a custom event on this element called
   * "countdown-start".
   */
  startCountdown () {
    this._countdownTimer.stopCountdown()
    this._countdownTimer.startCountdown(
      (timestamp) => this._dispatchStartEvent(timestamp),
      () => this._countdownComplete(),
      timeLeftMs => { this.currentDurationMs = timeLeftMs })
  }

  /**
   * Stops the current countdown. This sets the timer back to zero and cancels
   * any existing timeout. This dispatches a custom event on this element
   * called "countdown-stop".
   */
  stopCountdown () {
    this._countdownTimer.stopCountdown()

    this.currentDurationMs = 0
    this.dispatchEvent(new window.CustomEvent(EVENT_NAMES.COUNTDOWN_STOP, {
      detail: { id: this.id }
    }))
  }
}

// Register the custom element.
window.customElements.define('countdown-timer', CountdownTimerElement)
