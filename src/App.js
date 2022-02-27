import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { DATABASE } from "./constants.js";
import { CountdownTimer } from "./CountdownTimer.js";
import { db } from "./database.js";
import { EditableList } from "./EditableList.js";
import { TOAST_TYPES, Toasts } from "./Toasts.js";
import { useNotification } from "./useNotification";
import { useToasts } from "./useToasts";

const COUNTDOWN_ID = "countdown";
const DISTRACTIONS_ID = "distractions";
const COUNTDOWN_DURATION_MS = 25 * 60 * 1000;
const NOTIFICATION_ALERT_ID = "notificationPermissionAlert";

export function App() {
  const [completeNotification, setCompleteNotification] = useState();
  const { showNotification, shouldAskForPermission } = useNotification();
  const { showToast } = useToasts();

  const startTimestamp = useLiveQuery(
    async () => {
      const entry = await db.table(DATABASE.COUNTDOWNS.STORE).get(COUNTDOWN_ID);
      const startTimestamp = entry?.[DATABASE.COUNTDOWNS.START_TIMESTAMP];

      return startTimestamp + COUNTDOWN_DURATION_MS >= Date.now()
        ? startTimestamp
        : null;
    },
    [],
    null
  );

  const items = useLiveQuery(
    async () => {
      const entry = await db
        .table(DATABASE.LIST_ITEMS.STORE)
        .get(DISTRACTIONS_ID);

      return entry?.[DATABASE.LIST_ITEMS.ITEMS] ?? [];
    },
    [],
    []
  );

  const isNotificationDismissed = useLiveQuery(
    async () => {
      const entry = await db
        .table(DATABASE.ALERTS.STORE)
        .get(NOTIFICATION_ALERT_ID);

      return !!entry?.[DATABASE.ALERTS.DISMISSED];
    },
    [],
    true
  );

  async function onAlertClosed() {
    try {
      await dismissAlert(NOTIFICATION_ALERT_ID);
    } catch (error) {
      showToast({
        type: TOAST_TYPES.DANGER,
        headerText: "Error dismissing alert",
        bodyText: error.message,
      });
    }
  }

  async function onListUpdate({ currentItems }) {
    try {
      await saveListItems(DISTRACTIONS_ID, currentItems);
    } catch (error) {
      showToast({
        type: TOAST_TYPES.DANGER,
        headerText: "Error updating distractions",
        bodyText: error.message,
      });
    }
  }

  async function onCountdownTimerStart(startTimestamp) {
    try {
      await saveCountdownTimestamp(COUNTDOWN_ID, startTimestamp);
      completeNotification?.close?.();
    } catch (error) {
      showToast({
        type: TOAST_TYPES.DANGER,
        headerText: "Unable to start countdown timer",
        bodyText: error.message,
      });
    }
  }

  async function onCountdownTimerStop() {
    try {
      await saveCountdownTimestamp(COUNTDOWN_ID, null);
      completeNotification?.close?.();
    } catch (error) {
      showToast({
        type: TOAST_TYPES.DANGER,
        headerText: "Unable to stop countdown timer",
        bodyText: error.message,
      });
    }
  }

  async function onCountdownTimerComplete() {
    try {
      await saveCountdownTimestamp(COUNTDOWN_ID, null);

      const notification = await showNotification("Pomodoro Complete");
      setCompleteNotification(notification);
    } catch (error) {
      showToast({
        type: TOAST_TYPES.DANGER,
        headerText: "Error updating countdown timer",
        bodyText: error.message,
      });
    }
  }

  return (
    <div className={"container"}>
      <section>
        <Alert
          variant={"info"}
          show={shouldAskForPermission && !isNotificationDismissed}
          onClose={onAlertClosed}
          dismissible={true}
        >
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

      <Toasts />
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

async function dismissAlert(id) {
  return db.table(DATABASE.ALERTS.STORE).put({
    [DATABASE.ALERTS.ID]: id,
    [DATABASE.ALERTS.DISMISSED]: true,
  });
}
