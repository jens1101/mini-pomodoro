import Dexie from 'dexie'
import { DATABASE } from './constants.js'

export const db = new Dexie(DATABASE.NAME)

db.version(0.2)
  .stores({
    // TODO: add an elementId to countdowns so that we can draw stats. E.g.: how many pomodoros have been run
    countdownTimers: 'id',
    // TODO: rename `listId` to `elementId`
    listItems: '++id, listId'
  })
