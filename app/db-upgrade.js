import { DATABASE } from './constants.js'

/**
 * Upgrade code for the app's indexed database. This will upgrade the given DB
 * object to the latest version based on its current version.
 * @param {IDBDatabase} db The Indexed DB to upgrade.
 * @param {number} oldVersion The version of the Indexed DB before upgrading.
 */
export function dbUpgrade (db, oldVersion) {
  switch (oldVersion) {
    case 0:
      db.createObjectStore(DATABASE.COUNTDOWNS_STORE, {
        keyPath: DATABASE.COUNTDOWN_ID
      })
    // Fallthrough
    case 1:
      db.createObjectStore(DATABASE.LIST_ITEMS_STORE, {
        keyPath: DATABASE.LIST_ITEM_ID,
        autoIncrement: true
      }).createIndex(DATABASE.LIST_INDEX, DATABASE.LIST_ID)
  }
}
