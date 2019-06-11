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
export class CountdownTimer {
  /**
   * Returns the tick size (in milliseconds) to be used by the timer. This will
   * determine how regularly the timer will refresh.
   * @return {number} The tick size in milliseconds.
   */
  static TICK_SIZE_MS = 1000

  /**
   * Returns the default duration of the countdown timer in milliseconds.
   * @return {number}
   */
  static DEFAULT_DURATION_MS = 25 * 60 * 1000 /* 25 minutes */

  #currentTimeoutReference = null
  #durationMs = CountdownTimer.DEFAULT_DURATION_MS

  get durationMs () {
    return this.#durationMs
  }

  set durationMs (value) {
    if (!Number.isInteger(value)) {
      throw new TypeError('Duration must be an integer')
    }

    if (value <= 0) {
      throw new RangeError('Duration must be a positive integer')
    }

    this.#durationMs = value
  }

  /**
   * Starts the countdown. This first stops any existing countdown and then
   * stats it anew. This dispatches a custom event on this element called
   * "countdownstart".
   */
  startCountdown (startCallback, completeCallback, tickCallback) {
    if (this.#currentTimeoutReference) {
      throw new Error('Countdown already running')
    }

    const startTimestamp = Date.now()

    this.#tick(startTimestamp, 0, tickCallback, completeCallback)

    startCallback(startTimestamp)
  }

  /**
   * Stops the current countdown. This sets the timer back to zero and cancels
   * any existing timeout. This dispatches a custom event on this element
   * called "countdownstop".
   */
  stopCountdown () {
    clearTimeout(this.#currentTimeoutReference)
    this.#currentTimeoutReference = null
  }

  /**
   * Resumes the countdown using the given start timestamp. In effect this sets
   * the start timestamp and then starts the countdown, however no events will
   * be triggered.
   * @param {number} startTimestamp A Unix timestamp in milliseconds when this
   * timer was started.
   */
  resumeCountdown (startTimestamp, completeCallback, tickCallback) {
    if (this.#currentTimeoutReference) {
      throw new Error('Countdown already running')
    }

    this.#tick(startTimestamp, Date.now() - startTimestamp, tickCallback,
      completeCallback)
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
   * @see https://www.sitepoint.com/creating-accurate-timers-in-javascript/ for
   * details about this algorithm.
   */
  #tick = (startTimestamp, elapsedMs, tickCallback, completeCallback) => {
    // This gets the difference between how may milliseconds are *supposed to*
    // have elapsed and how many have *actually* elapsed. This is how much
    // inaccuracy has accumulated so far.
    let inaccuracy = (Date.now() - startTimestamp) - elapsedMs

    // This is responsible for adjusting the timer so that it's accurate on the
    // second. Otherwise the second digits may update off the second, which we
    // don't want
    let nextTickSize

    // If the inaccuracy is larger than the tick size then the displayed time
    // should jump to the most recent tick.
    if (inaccuracy > CountdownTimer.TICK_SIZE_MS) {
      // This is the remainder of milliseconds after the timer would be
      // adjusted. This is used so that the timer still self-adjusts.
      const mod = inaccuracy % CountdownTimer.TICK_SIZE_MS

      // This updates the elapsed milliseconds to jump to the most recent tick
      // (thus jumping the majority of the inaccuracy).
      elapsedMs = elapsedMs + inaccuracy - mod

      // Update the inaccuracy value because `elapsedMs` has been adjusted to
      // the closest tick.
      inaccuracy = mod
    }

    // This gets the next tick size by subtracting the inaccuracy from the
    // default tick size. The next tick will therefore complete quicker if there
    // was an inaccuracy.
    nextTickSize = CountdownTimer.TICK_SIZE_MS - inaccuracy

    if (elapsedMs >= this.#durationMs) {
      // If more time has elapsed than the duration of the countdown timer then
      // dispatch the "countdowncomplete" event and stop the timer.

      completeCallback()

      // Note that the `stopCountdown` function will display "00:00". Thus we
      // don't need an extra call to `_displayTime`.
      this.stopCountdown()
      return
    } else {
      // If there is still time left then display it to the user.

      tickCallback(this.#durationMs - elapsedMs, elapsedMs, this.#durationMs)
    }

    // This recursively calls the next `#tick` using a `setTimeout`. We use
    // recursive `setTimeout` calls instead of `setInterval`, because
    // `setInterval` tends to be suspended by the browser once the web page
    // goes into the background. `setInterval` also tends to be more inaccurate,
    // because it cannot be corrected per tick.
    this.#currentTimeoutReference = setTimeout(this.#tick.bind(this),
      nextTickSize,
      startTimestamp,
      elapsedMs + CountdownTimer.TICK_SIZE_MS,
      tickCallback,
      completeCallback)
  }
}
