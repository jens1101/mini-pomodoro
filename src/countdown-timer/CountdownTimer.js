/**
 * Class which creates a countdown timer. The duration can be customised. The
 * following callbacks are possible:
 * - On countdown start
 * - On countdown completion
 * - On each tick of the countdown timer
 */
export class CountdownTimer {
  /**
   * Gets called whenever the countdown timer started.
   * @callback CountdownTimer~startCallback
   * @param {number} startTimestamp An exact timestamp on which the countdown
   * timer was started.
   */

  /**
   * Gets called whenever the countdown timer has completed
   * @callback CountdownTimer~completeCallback
   */

  /**
   * @callback CountdownTimer~tickCallback
   * @param {number} timeLeftMs The number of milliseconds that are still left
   * to count down.
   * @param {number} elapsedMs The number of milliseconds that have passed
   * already.
   * @param {number} durationMs The total duration of the countdown timer in
   * milliseconds.
   */

  /**
   * The tick size (in milliseconds) to be used by the timer. This also
   * determines how precise the timer will be. Note that due to browser
   * restrictions accuracy can never truly be guaranteed.
   * @type {number} The tick size in milliseconds.
   */
  static TICK_SIZE_MS = 1000

  /**
   * The default duration of the countdown timer in milliseconds.
   * @type {number}
   */
  static DEFAULT_DURATION_MS = 25 * 60 * 1000 /* 25 minutes */

  /**
   * Holds a reference to the currently running timeout. If no countdown is
   * running then this should be set to `null`.
   * @type {?number}
   */
  #currentTimeoutReference = null

  /**
   * How long the countdown timer should run. This defaults to the default
   * duration, but can be changed.
   * @type {number}
   */
  #durationMs = CountdownTimer.DEFAULT_DURATION_MS

  /**
   * Gets the current countdown duration of this countdown timer.
   * @returns {number}
   */
  get durationMs () {
    return this.#durationMs
  }

  /**
   * Sets the duration of this countdown timer.
   * @param {number} durationMs The new duration of this countdown timer in
   * milliseconds.
   * @throws {TypeError} If the duration is not an integer
   * @throws {RangeError} If the duration is not a positive integer
   */
  set durationMs (durationMs) {
    if (!Number.isInteger(durationMs)) {
      throw new TypeError('Duration must be an integer')
    }

    if (durationMs <= 0) {
      throw new RangeError('Duration must be a positive integer')
    }

    this.#durationMs = durationMs
  }

  /**
   * Starts the countdown and then calls a callback function. If a countdown is
   * already running then an error will be thrown.
   * @param {CountdownTimer~startCallback} startCallback Gets called when the
   * countdown timer has successfully started.
   * @param {CountdownTimer~completeCallback} completeCallback Gets called after
   * the countdown has completed.
   * @param {CountdownTimer~tickCallback} tickCallback Gets called on each tick
   * of the countdown timer. This is useful for displaying the current countdown
   * status.
   * @throws {Error} Throws an error when a countdown timer is already running.
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
   * Stops the current countdown. This cancels the current timeout and sets it
   * back to `null`
   */
  stopCountdown () {
    clearTimeout(this.#currentTimeoutReference)
    this.#currentTimeoutReference = null
  }

  /**
   * Resumes the countdown using the given start timestamp. This uses the
   * difference between the current timestamp and the given timestamp to resume
   * the countdown. It also doesn't trigger any special callbacks unlike the
   * `startCountdown` function.
   * @param {number} startTimestamp A Unix timestamp in milliseconds when this
   * timer was started.
   * @param {CountdownTimer~completeCallback} completeCallback Gets called after
   * the countdown has completed.
   * @param {CountdownTimer~tickCallback} tickCallback Gets called on each tick
   * of the countdown timer. This is useful for displaying the current countdown
   * status.
   * @throws {Error} Throws an error when a countdown timer is already running.
   */
  resumeCountdown (startTimestamp, completeCallback, tickCallback) {
    if (this.#currentTimeoutReference) {
      throw new Error('Countdown already running')
    }

    this.#tick(startTimestamp, Date.now() - startTimestamp, tickCallback,
      completeCallback)
  }

  /**
   * Private function which is actually responsible for the countdown. This
   * function gets called to start the countdown and will recursively call
   * itself until the countdown is complete. On each tick this will call the
   * given `tickCallback` function and upon completion it will call the given
   * `completeCallback` function.
   * @private
   * @param {number} startTimestamp A Unix timestamp in milliseconds when this
   * timer was started.
   * @param {number} elapsedMs The number of milliseconds that have *supposed to
   * be* passed since the starting timestamp. In reality more time may have
   * passed due to the asynchronous nature of `setTimeout`, but we use this
   * parameters to correct such deviation.
   * @param {CountdownTimer~tickCallback} tickCallback Gets called on each tick
   * of the countdown timer.
   * @param {CountdownTimer~completeCallback} completeCallback Gets called after
   * the countdown has completed.
   * @see https://www.sitepoint.com/creating-accurate-timers-in-javascript/ for
   * details about this algorithm.
   */
  #tick = (startTimestamp, elapsedMs, tickCallback, completeCallback) => {
    // This gets the difference between how may milliseconds are *supposed to*
    // have elapsed and how many have *actually* elapsed. This is how much
    // inaccuracy has accumulated so far.
    let inaccuracy = (Date.now() - startTimestamp) - elapsedMs

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

    // This is responsible for adjusting the timer so that it's (approximately)
    // accurate on the tick.
    //
    // This gets the next tick size by subtracting the inaccuracy from the
    // default tick size. The next tick will therefore complete quicker if there
    // was an inaccuracy.
    const nextTickSize = CountdownTimer.TICK_SIZE_MS - inaccuracy

    if (elapsedMs >= this.#durationMs) {
      // If more time has elapsed than the duration of the countdown timer then
      // call the `completeCallback` and stop the timer.

      completeCallback()
      this.stopCountdown()
      return
    } else {
      // If there is still time left then call the `tickCallback`.

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
