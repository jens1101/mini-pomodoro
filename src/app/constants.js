/**
 * @callback EventCallback
 * @param {Event} event
 */

/**
 * @callback CustomEventCallback
 * @param {CustomEvent} event
 */

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
  COUNTDOWNS: {
    /**
     * The table in which all countdown timers are stored.
     */
    STORE: 'countdownTimers',
    /**
     * The key path for individual countdown timers. This is used to uniquely
     * identify each countdown timer.
     */
    ID: 'id',
    /**
     * The timestamp when each countdown timer started.
     */
    START_TIMESTAMP: 'startTimestamp'
  },
  LIST_ITEMS: {
    /**
     * The table in which all list items get stored. This is currently used by
     * the "distractions" list.
     */
    STORE: 'listItems',
    /**
     * The key path for lists. This is used to uniquely identify each list.
     * @type {string}
     */
    ID: 'id',
    /**
     * The key path for all items per list
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
