/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 * @typedef TemplateResult
 * @property {TemplateStringsArray} strings
 * @property {*[]} values
 * @property {string} type
 * @property {Function<string>} getHTML Returns a string of HTML used to create
 * a `<template>` element.
 * @property {Function<HTMLTemplateElement>} getTemplateElement
 */

/**
 * @typedef CSSResult
 * @property {string} cssText
 * @property {CSSStyleSheet|null} [_styleSheet]
 * @property {CSSStyleSheet|null} styleSheet
 * @property {Function<string>} toString
 */

/**
 * Contains related to the app's database.
 * @type {Object}
 */
export const DATABASE = {
  /**
   * The name of the database in which this app resides.
   * @type {string}
   */
  NAME: "miniPomodoro",
  /**
   * All constants related to the countdown timers.
   * @type {Object}
   */
  COUNTDOWNS: {
    /**
     * The table in which all countdown timers are stored.
     * @type {string}
     */
    STORE: "countdownTimers",
    /**
     * The key path for individual countdown timers. This is used to uniquely
     * identify each countdown timer.
     * @type {string}
     */
    ID: "id",
    /**
     * The timestamp when each countdown timer started.
     * @type {string}
     */
    START_TIMESTAMP: "startTimestamp",
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
    STORE: "listItems",
    /**
     * The key path for lists. This is used to uniquely identify each list.
     * @type {string}
     */
    ID: "id",
    /**
     * The key path for all items per list
     * @type {string}
     */
    ITEMS: "items",
  },

  /**
   * All constants related to alerts.
   * @type {Object}
   */
  ALERTS: {
    /**
     * The table in which all alert-related data is stored.
     * @type {string}
     */
    STORE: "alerts",
    /**
     * The key path for alerts. This is used to uniquely identify each alert.
     * @type {string}
     */
    ID: "id",
    /**
     * The key path for whether the current alert has been dismissed.
     * @type {string}
     */
    DISMISSED: "dismissed",
  },
};

/**
 * Enum containing all possible notification permission states.
 * @type {Object}
 */
export const NOTIFICATION_PERMISSION = {
  /**
   * The user refuses to have notifications displayed.
   * @type {string}
   */
  DENIED: "denied",
  /**
   * The user accepts having notifications displayed.
   * @type {string}
   */
  GRANTED: "granted",
  /**
   * The user choice is unknown and therefore the browser will act as if the
   * value were denied.
   * @type {string}
   */
  DEFAULT: "default",
};
