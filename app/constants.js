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
   * The table in which all countdown timers are stored.
   * @type {string}
   */
  COUNTDOWNS_STORE: 'countdownTimers',
  /**
   * The key path for individual countdown timers. This is used to uniquely
   * identify each countdown timer.
   * @type {string}
   */
  COUNTDOWN_ID: 'id',
  /**
   * The table in which all list items get stored. This is currently used by
   * the "distractions" list.
   * @type {string}
   */
  LIST_ITEMS_STORE: 'listItems',
  /**
   * The key path for individual list items. This is a unique, auto-incrementing
   * key that uniquely identifies each list item.
   * @type {string}
   */
  LIST_ITEM_ID: 'id',
  /**
   * The key path for lists. This is used to create an index which groups list
   * items by the lists in which they are found. This allows us to retrieve the
   * contents of entire lists.
   * @type {string}
   */
  LIST_ID: 'listId',
  /**
   * The name of the index that's applied to the list items table. This is
   * primarily used to find all list items that belong to a list with the given
   * ID.
   * @type {string}
   */
  LIST_INDEX: 'listIdIndex'
}
