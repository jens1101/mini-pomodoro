/**
 * Upgrade code for the app's indexed database. This will upgrade the given DB
 * object to the latest version based on its current version.
 * @param {IDBDatabase} db The Indexed DB to upgrade.
 */
export function dbUpgrade (db) {
  switch (db.oldVersion) {
    case 0:
      db.createObjectStore('countdown-timers', { keyPath: 'id' })
  }
}
