import { LitElement } from '../../web_modules/lit-element.js'
import { bootstrapCssResult } from '../app/bootstrap.js'
import { CountdownTimer } from './CountdownTimer.js'
import { template } from './template.js'

export class CountdownTimerElement extends LitElement {
  constructor () {
    super()

    /**
     * The countdown timer that is responsible for the actual timer logic.
     * @type {CountdownTimer}
     */
    this._countdownTimer = new CountdownTimer()

    this.totalDurationMs = CountdownTimer.DEFAULT_DURATION_MS
    this.currentDurationMs = 0
    this.startButtonText = 'Start'
    this.stopButtonText = 'Stop'
  }

  static get properties () {
    return {
      totalDurationMs: { type: Number },
      currentDurationMs: { attribute: false },
      startButtonText: { type: String },
      stopButtonText: { type: String }
    }
  }

  static get styles () {
    return bootstrapCssResult
  }

  /**
   * This is called once this countdown timer has completed. Displays 00:00:00
   * for the countdown time and dispatches the "countdowncomplete" event on this
   * element.
   * @private
   */
  _countdownComplete () {
    this.currentDurationMs = 0
    this.dispatchEvent(new window.CustomEvent('countdowncomplete'))
  }

  /**
   * Dispatches the "countdownstart" event on this element. This is called when
   * the user starts the countdown timer. The start timestamp is sent as
   * additional details.
   * @private
   * @param {number} startTimestamp The timestamp when the countdown timer
   * started.
   */
  _dispatchStartEvent (startTimestamp) {
    const event = new window.CustomEvent('countdownstart', {
      detail: { startTimestamp }
    })
    this.dispatchEvent(event)
  }

  render () {
    return template(this.currentDurationMs, this.totalDurationMs, {
      startButtonText: this.startButtonText,
      startCountdownCallback: () => this.startCountdown(),
      stopButtonText: this.stopButtonText,
      stopCountdownCallback: () => this.stopCountdown()
    })
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
   * "countdownstart".
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
   * called "countdownstop".
   */
  stopCountdown () {
    this._countdownTimer.stopCountdown()

    this.currentDurationMs = 0
    this.dispatchEvent(new window.CustomEvent('countdownstop'))
  }
}
