/**
 * Upgrade code for the app's indexed database. This will upgrade the given DB
 * object to the latest version based on its current version.
 * @param {IDBDatabase} db The Indexed DB to upgrade.
 * @param {number} oldVersion The version of the Indexed DB before upgrading.
 * @param {IDBTransaction} transaction The transaction that wraps this upgrade.
 */
export function dbUpgrade (db, oldVersion, transaction) {
  // Note that values in this file are hard-coded, even though constants are
  // available and preferred. The reason for this is if names change then old
  // migrations and DB instances will not break as a result of such a change.

  switch (oldVersion) {
    case 0:
      // Create the object store for the countdown timers
      db.createObjectStore('countdown-timers', {
        keyPath: 'id'
      })
    // Fallthrough
    case 1:
      // Rename the countdown timers object store. This is done due to a change
      // in naming conventions.
      transaction.objectStore('countdown-timers').name = 'countdownTimers'

      // Create the object store for the list items
      db.createObjectStore('listItems', {
        keyPath: 'id',
        autoIncrement: true
      }).createIndex('listIdIndex', 'listId')
  }
}
