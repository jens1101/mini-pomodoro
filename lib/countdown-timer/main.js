/* globals HTMLElement, CustomEvent */

import {Template} from '../jt-component/main.js'

/**
 * Custom component which creates a countdown timer. The following attributes
 * are available:
 * `duration-ms` Optional. The number of milliseconds this countdown timer will
 * run for. If not sepcified then it will run for 25 minutes.
 * `start-text` Optional. The text to display on the start button. Defaults to
 * "Start".
 * `stop-text` Optional. The text to display on the stop button. Defaults to
 * "Stop".
 */
export class CountdownTimer extends HTMLElement {
  /**
   * Specifies the observed attributes so that `attributeChangedCallback` will
   * work
   * @return {string[]}
   */
  static get observedAttributes () {
    return ['duration-ms', 'start-text', 'stop-text']
  }

  /**
   * Returns the tick size (in milliseconds) to be used by the timer. This will
   * determine how regularly the timer will refresh.
   * @return {number} The tick size in milliseconds.
   */
  static get TICK_SIZE_MS () { return 1000 }

  /**
   * Returns the default duration of the countdown timer in milliseconds.
   * @return {number}
   */
  static get DEFAULT_DURATION_MS () { return 25 * 60 * 1000 /* 25 minutes */ }

  /**
   * This constructor sets up the contents of this component and initialises all
   * variables.
   */
  constructor () {
    super()

    this._currentTimeoutReference = null
    this._durationMs = CountdownTimer.DEFAULT_DURATION_MS

    const templateUrl = new URL('./index.html', import.meta.url)
    // This promise is used to wait for the setup to finish.
    this._setupPromise = this._setupTemplate(templateUrl)
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
        if (isNaN(newValue)) {
          this._durationMs = CountdownTimer.DEFAULT_DURATION_MS
        } else {
          this._durationMs = parseInt(newValue)
        }
        break
      case 'start-text':
        this._startCountdownElement.textContent = newValue
        break
      case 'stop-text':
        this._stopCountdownElement.textContent = newValue
        break
    }
  }

  /**
   * Starts the countdown. This first stops any existing countdown and then
   * stats it anew. This dispatches a custom event on this element called
   * "countdownstart".
   */
  startCountdown () {
    if (this._currentTimeoutReference) {
      this.stopCountdown()
    }

    this._tick(Date.now(), 0)

    const event = new CustomEvent('countdownstart')
    this.dispatchEvent(event)
  }

  /**
   * Stops the current countdown. This sets the timer back to zero and cancels
   * any existing timeout. This dispatches a custom event on this element
   * called "countdownstop".
   */
  stopCountdown () {
    clearTimeout(this._currentTimeoutReference)
    this._currentTimeoutReference = null
    this._displayTime(0)

    const event = new CustomEvent('countdownstop')
    this.dispatchEvent(event)
  }

  /**
   * Gets the template for the current component and does any necessary setup.
   * This includes creating and attaching the shadow root.
   * @param {(Url|string)} templateUrl
   * @return {ShadowRoot}
   */
  async _setupTemplate (templateUrl) {
    const template = await Template.initWithUrl(templateUrl)
    this._timeDisplayElement = template.element.getElementById('time-display')

    this._startCountdownElement = template.element.getElementById('start-countdown')
    this._startCountdownElement.addEventListener('click', () => this.startCountdown())

    this._stopCountdownElement = template.element.getElementById('stop-countdown')
    this._stopCountdownElement.addEventListener('click', () => this.stopCountdown())

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.element)
    shadowRoot.appendChild(template.stylesheet)

    return shadowRoot
  }

  /**
   * Private function which is actually responsible for the countdown. It
   * displays the time in the view and stops the countdown once it's done. This
   * also dispatches a "countdowncomplete" event on this element once it's done.
   * This function gets called to start the countdown and will recursively call
   * itself until the contdown is complete.
   * @private
   * @param {number} startTimestamp A Unix timestamp in millisecons when this
   * timer was started.
   * @param {number} elapsedMs The number of millisecons that have *supposed to
   * be* passed since the starting timestamp. In reality more time may have
   * passed due to the asynchronous nature of `setTimeout`, but we use this
   * parameters to correct such deviation.
   */
  _tick (startTimestamp, elapsedMs) {
    this._displayTime(this._durationMs - elapsedMs)

    if (elapsedMs >= this._durationMs) {
      // If more time has elapsed than the duration of the countdown timer then
      // dispatch the "countdowncomplete" event and stop the timer.

      this.dispatchEvent(new CustomEvent('countdowncomplete'))
      this.stopCountdown()
      return
    }

    // This code below accounts for any inaccuracies that may have accumulated
    // and corrects them.

    // This gets the difference between how may milliseconds are *supposed to*
    // have ellapsed and how many have *actually* ellapsed. This is how much
    // inaccuracy has accumulated so far.
    const inaccuracy = (Date.now() - startTimestamp) - elapsedMs
    // This gets the next tick size by subtracting the inaccuracy from the
    // default tick size. The next tick will therefore complete quicker.
    const nextTickSize = CountdownTimer.TICK_SIZE_MS - inaccuracy
    // This recursively calls the next `_tick` using a `setTimeout`. We use
    // recursive `setTimeout` calls instead of `setInterval`, because
    // `setInterval` tends to be suspended by the browser once the web page
    // goes into the background. `setInterval` also tends to be more inaccurate,
    // because it cannot be corrected per tick.
    this._currentTimeoutReference = setTimeout(this._tick.bind(this),
      nextTickSize,
      startTimestamp,
      elapsedMs + CountdownTimer.TICK_SIZE_MS)
  }

  /**
   * Displays the current countdown time in the element in the format:
   * "hh:mm:ss".
   * @private
   * @param durationMs The number of millisecons that are still left for this
   * countdown timer.
   */
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
