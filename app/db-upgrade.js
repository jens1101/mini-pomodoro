/**
 * Upgrade code for the app's indexed database. This will upgrade the given DB
 * object to the latest version based on its current version.
 * @param {IDBDatabase} db The Indexed DB to upgrade.
 * @param {number} oldVersion The version of the Indexed DB before upgrading.
 */
export function dbUpgrade (db, oldVersion) {
  switch (oldVersion) {
    case 0:
      db.createObjectStore('countdown-timers', { keyPath: 'id' })
    // Fallthrough
    case 1:
      const editableListObjectStore = db.createObjectStore('editable-lists', {
        keyPath: 'keyId',
        autoIncrement: true
      })

      editableListObjectStore.createIndex('elementIdIndex', 'elementId')
  }
}
