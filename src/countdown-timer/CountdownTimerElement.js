import { LitElement } from 'lit-element'
import { template } from './template.js'
import { CountdownTimer } from './CountdownTimer.js'

export class CountdownTimerElement extends LitElement {
  /**
   * The countdown timer that is responsible for the actual timer logic.
   * @type {CountdownTimer}
   */
  #countdownTimer = new CountdownTimer()
  #displayDuration = CountdownTimerElement.durationToDisplayString(0)
  #startButtonText = 'Start'
  #stopButtonText = 'Stop'

  static durationToDisplayString (durationMs) {
    const durationSeconds = durationMs / 1000
    const seconds = `${Math.floor(durationSeconds % 60)}`.padStart(2, '0')

    const durationMinutes = durationSeconds / 60
    const minutes = `${Math.floor(durationMinutes % 60)}`.padStart(2, '0')

    const hours = `${Math.floor(minutes / 60)}`.padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  setDisplayDuration (durationMs) {
    const displayDuration =
      CountdownTimerElement.durationToDisplayString(durationMs)

    if (this.#displayDuration === displayDuration) {
      return
    }

    this.#displayDuration = displayDuration
    // noinspection JSIgnoredPromiseFromCall
    this.requestUpdate()
  }

  render () {
    return template(this.#displayDuration, {
      startButtonText: this.#startButtonText,
      startCountdownCallback: () => this.startCountdown(),
      stopButtonText: this.#stopButtonText,
      stopCountdownCallback: () => this.stopCountdown()
    })
  }

  /**
   * Dispatches the "countdownstart" event on this element. This is called when
   * the user starts the countdown timer. The start timestamp is sent as
   * additional details.
   * @param {number} startTimestamp The timestamp when the countdown timer
   * started.
   */
  #dispatchStartEvent = (startTimestamp) => {
    const event = new window.CustomEvent('countdownstart', {
      detail: { startTimestamp }
    })
    this.dispatchEvent(event)
  }

  /**
   * This is called once this countdown timer has completed. Displays 00:00:00
   * for the countdown time and dispatches the "countdowncomplete" event on this
   * element.
   */
  #countdownComplete = () => {
    this.setDisplayDuration(0)
    this.dispatchEvent(new window.CustomEvent('countdowncomplete'))
  }

  /**
   * Starts the countdown. This first stops any existing countdown and then
   * stats it anew. This dispatches a custom event on this element called
   * "countdownstart".
   */
  startCountdown () {
    this.#countdownTimer.stopCountdown()
    this.#countdownTimer.startCountdown(this.#dispatchStartEvent,
      this.#countdownComplete, timeLeftMs => this.setDisplayDuration(timeLeftMs))
  }

  /**
   * Stops the current countdown. This sets the timer back to zero and cancels
   * any existing timeout. This dispatches a custom event on this element
   * called "countdownstop".
   */
  stopCountdown () {
    this.#countdownTimer.stopCountdown()

    this.setDisplayDuration(0)
    this.dispatchEvent(new window.CustomEvent('countdownstop'))
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
      this.#countdownComplete, timeLeftMs => this.setDisplayDuration(timeLeftMs))
  }
}
