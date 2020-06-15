/**
 * Contains constants related to the app's database.
 * @type {Object}
 */
export const DATABASE = {
  /**
   * The name of the database in which this app resides.
   * @type {string}
   */
  NAME: 'miniPomodoro',
  /**
   * All constants related to the countdown timers.
   * @type {Object}
   */
  COUNTDOWNS: {
    /**
     * The table in which all countdown timers are stored.
     * @type {string}
     */
    STORE: 'countdownTimers',
    /**
     * The key path for individual countdown timers. This is used to uniquely
     * identify each countdown timer.
     * @type {string}
     */
    ID: 'id',
    /**
     * The timestamp when each countdown timer started.
     * @type {string}
     */
    START_TIMESTAMP: 'startTimestamp'
  },
  /**
   * All constants related to list items.
   * @type {Object}
   */
  LIST_ITEMS: {
    /**
     * The table in which all list items get stored. This is currently used by
     * the "distractions" list.
     * @type {string}
     */
    STORE: 'listItems',
    /**
     * The key path for lists. This is used to uniquely identify each list.
     * @type {string}
     */
    ID: 'id',
    /**
     * The key path for all items per list
     * @type {string}
     */
    ITEMS: 'items'
  }
}

/**
 * All the event names used throughout this app.
 * @type {Object}
 */
export const EVENT_NAMES = {
  COUNTDOWN_COMPLETE: 'countdown-complete',
  COUNTDOWN_START: 'countdown-start',
  COUNTDOWN_STOP: 'countdown-stop',
  LI_ADDED: 'li-added',
  LI_REMOVED: 'li-removed'
}
