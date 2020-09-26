import React, { useState, useEffect } from "react";
import { DATABASE } from "./constants.js";
import { CountdownTimer } from "./CountdownTimer.js";
import { db } from "./database.js";
import { EditableList } from "./EditableList.js";
import { TOAST_TYPES, ToastContainer } from "./ToastContainer.js";

export function App() {
  const countdownId = "countdown";
  const distractionsId = "distractions";
  const countdownDurationMs = 10000;
  const [toasts, setToasts] = useState([]);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.table(DATABASE.COUNTDOWNS.STORE)
      .get(countdownId)
      .then((entry) => {
        if (!entry) return;

        const startTimestamp = entry[DATABASE.COUNTDOWNS.START_TIMESTAMP];

        if (startTimestamp + countdownDurationMs < Date.now()) return;

        setStartTimestamp(startTimestamp);
      });

    db.table(DATABASE.LIST_ITEMS.STORE)
      .get(distractionsId)
      .then((entry) => {
        if (!entry) return;

        setItems(entry[DATABASE.LIST_ITEMS.ITEMS]);
      });
  }, [countdownDurationMs]);

  function onToastClose(toast) {
    setToasts(toasts.filter((currentToast) => currentToast !== toast));
  }

  async function onListUpdate({ currentItems, previousItems }) {
    try {
      await saveListItems(distractionsId, currentItems);
      setItems(currentItems);
    } catch (error) {
      setItems(previousItems);

      setToasts((toasts) => [
        ...toasts,
        {
          type: TOAST_TYPES.DANGER,
          headerText: "Error updating distractions",
          bodyText: error.message,
        },
      ]);
    }
  }

  async function onCountdownTimerUpdate(startTimestamp = null) {
    try {
      await saveCountdownTimestamp(countdownId, startTimestamp);
      setStartTimestamp(startTimestamp);
    } catch (error) {
      setStartTimestamp(null);

      setToasts((toasts) => [
        ...toasts,
        {
          type: TOAST_TYPES.DANGER,
          headerText: "Error updating countdown timer",
          bodyText: error.message,
        },
      ]);
    }
  }

  return (
    <div className={"container"}>
      <CountdownTimer
        startTimestamp={startTimestamp}
        onStart={onCountdownTimerUpdate}
        onStop={onCountdownTimerUpdate}
        onComplete={onCountdownTimerUpdate}
        durationMs={countdownDurationMs}
        startButtonText={"Start"}
        stopButtonText={"Stop"}
      />

      <EditableList
        items={items}
        placeholder={"Note a distraction"}
        addButtonText={"Add"}
        onAdd={onListUpdate}
        onRemove={onListUpdate}
      />

      <ToastContainer toasts={toasts} onClose={onToastClose} />
    </div>
  );
}

/**
 * Saves the given timestamp as the start timestamp for the current countdown
 * element in the current DB.
 * @return {Promise<string>} Resolves into the ID of the countdown
 */
async function saveCountdownTimestamp(id, startTimestamp) {
  return db.table(DATABASE.COUNTDOWNS.STORE).put({
    [DATABASE.COUNTDOWNS.ID]: id,
    [DATABASE.COUNTDOWNS.START_TIMESTAMP]: startTimestamp,
  });
}

/**
 * Updates the list with the specified ID. If the list doesn't exist in the
 * table then a new row is created instead.
 * @param {string} id The ID of the list
 * @param {EditableListItem[]} items The new array of items to update the
 * list to
 * @returns {Promise<string>} If the operation succeeds then resolves to the
 * key under which the list was stored in the table
 * @throws {DexieError} If the DB operation failed
 */
async function saveListItems(id, items) {
  return db.table(DATABASE.LIST_ITEMS.STORE).put({
    [DATABASE.LIST_ITEMS.ID]: id,
    [DATABASE.LIST_ITEMS.ITEMS]: items,
  });
}
