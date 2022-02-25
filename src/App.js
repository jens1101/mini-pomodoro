import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import pomodoroOverUrl from "./assets/pomodoro-over.mp3";
import { DATABASE } from "./constants.js";
import { CountdownTimer } from "./CountdownTimer.js";
import { db } from "./database.js";
import { EditableList } from "./EditableList.js";
import { TOAST_TYPES, Toasts } from "./Toasts.js";
import { useNotification } from "./useNotification";

const COUNTDOWN_ID = "countdown";
const DISTRACTIONS_ID = "distractions";
const COUNTDOWN_DURATION_MS = 25 * 60 * 1000;

export function App() {
  const [toasts, setToasts] = useState([]);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [items, setItems] = useState([]);
  const [completeNotification, setCompleteNotification] = useState();
  const { showNotification, shouldAskForPermission } = useNotification();

  function onToastClose(toast) {
    setToasts(toasts.filter((currentToast) => currentToast !== toast));
  }

  async function onListUpdate({ currentItems, previousItems }) {
    try {
      await saveListItems(DISTRACTIONS_ID, currentItems);
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

  async function onCountdownTimerStart(startTimestamp) {
    try {
      await saveCountdownTimestamp(COUNTDOWN_ID, startTimestamp);
      setStartTimestamp(startTimestamp);
      completeNotification?.close?.();
    } catch (error) {
      onCountdownUpdateError(error);
    }
  }

  async function onCountdownTimerStop() {
    try {
      await saveCountdownTimestamp(COUNTDOWN_ID, null);
      setStartTimestamp(null);
      completeNotification?.close?.();
    } catch (error) {
      onCountdownUpdateError(error);
    }
  }

  async function onCountdownTimerComplete() {
    try {
      await saveCountdownTimestamp(COUNTDOWN_ID, null);
      setStartTimestamp(null);

      const notification = await showNotification("Pomodoro Complete", {
        soundUrl: pomodoroOverUrl,
      });

      setCompleteNotification(notification);
    } catch (error) {
      onCountdownUpdateError(error);
    }
  }

  function onCountdownUpdateError(error) {
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

  useEffect(() => {
    db.table(DATABASE.COUNTDOWNS.STORE)
      .get(COUNTDOWN_ID)
      .then((entry) => {
        if (!entry) return;

        const startTimestamp = entry[DATABASE.COUNTDOWNS.START_TIMESTAMP];

        if (startTimestamp + COUNTDOWN_DURATION_MS < Date.now()) return;

        setStartTimestamp(startTimestamp);
      });

    db.table(DATABASE.LIST_ITEMS.STORE)
      .get(DISTRACTIONS_ID)
      .then((entry) => {
        if (!entry) return;

        setItems(entry[DATABASE.LIST_ITEMS.ITEMS]);
      });
  }, []);

  return (
    <div className={"container"}>
      <section>
        <Alert variant={"info"} show={shouldAskForPermission}>
          <Alert.Heading>Notification Permission</Alert.Heading>
          <p>Please grant us permission to show you notifications</p>
        </Alert>
      </section>

      <section className={"my-3"}>
        <CountdownTimer
          startTimestamp={startTimestamp}
          onStart={onCountdownTimerStart}
          onStop={onCountdownTimerStop}
          onComplete={onCountdownTimerComplete}
          durationMs={COUNTDOWN_DURATION_MS}
          startButtonText={"Start"}
          stopButtonText={"Stop"}
        />
      </section>

      <section>
        <h2>Distractions</h2>
        <EditableList
          items={items}
          placeholder={"Note a distraction"}
          addButtonText={"Add"}
          onAdd={onListUpdate}
          onRemove={onListUpdate}
        />
      </section>

      <Toasts toasts={toasts} onClose={onToastClose} />
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
