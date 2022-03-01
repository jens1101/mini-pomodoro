import Dexie from "dexie";
import { DATABASE } from "./constants.js";

/**
 * The connection to the local Indexed DB. All DB operations should use this
 * connection.
 * @type {Dexie}
 */
export const db = new Dexie(DATABASE.NAME);

// # DB Migrations

// v0.2: Initial state
db.version(0.2).stores({
  countdownTimers: "id",
  listItems: "++id, listId",
});

// v2: Remove the list items store and re-create it. The structure changed, the
// list items are now stored in an array instead of as individual strings.
db.version(1).stores({ listItems: null });
db.version(2).stores({ listItems: "id" });

// v3: Add store for saving alert data
db.version(3).stores({ alerts: "id" });
