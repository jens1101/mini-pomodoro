import Dexie from 'dexie'
import { DATABASE } from './constants.js'

export const db = new Dexie(DATABASE.NAME)

db.version(0.2)
  .stores({
    countdownTimers: 'id',
    listItems: '++id, listId'
  })

db.version(1).stores({ listItems: null })

db.version(2).stores({ listItems: 'id' })
