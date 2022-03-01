import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { DATABASE } from "./constants.js";
import { CountdownTimer } from "./CountdownTimer.js";
import { db } from "./database.js";
import { EditableList } from "./EditableList.js";
import { TOAST_TYPES, Toasts } from "./Toasts.js";
import { useNotification } from "./useNotification";
import { useToasts } from "./useToasts";

/**
 * The ID of the countdown timer used in this component. This is used to store
 * it's state in IDB.
 * @type {string}
 */
const COUNTDOWN_ID = "countdown";

/**
 * The ID of list of distractions used in this component. This is used to store
 * it's state in IDB.
 * @type {string}
 */
const DISTRACTIONS_ID = "distractions";

/**
 * The ID of the alert used in this component. This is used to store it's state
 * in IDB.
 * @type {string}
 */
const NOTIFICATION_ALERT_ID = "notificationPermissionAlert";

/**
 * The number of milliseconds for how long a pomodoro countdown will last.
 * @type {number}
 */
const COUNTDOWN_DURATION_MS = 25 * 60 * 1000;

/**
 * The root component for the entire app
 * @return {JSX.Element}
 */
export function App() {
  /**
   * The notification that is shown when the timer completes.
   * @type {[Notification, function(Notification)]}
   */
  const [completeNotification, setCompleteNotification] = useState();
  const { showNotification, shouldAskForPermission } = useNotification();
  const { showToast } = useToasts();

  /**
   * The timestamp for when the pomodoro timer started counting down or null if
   * the timer isn't currently running.
   * @type {number|null}
   */
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

  /**
   * All the distractions that have been noted down.
   * @type {EditableListItem[]}
   */
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

  /**
   * Weather or not the alert for requesting notification permission has been
   * dismissed by the user.
   * @type {boolean}
   */
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

  /**
   * Handler for when the user dismissed the alert requesting for notification
   * permission. A toast will be shown when an error occurred.
   * @return {Promise<void>}
   */
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

  /**
   * Handler for when the current list of distractions has been updated. A toast
   * will be shown when an error occurred.
   * @param {Object} options
   * @param {EditableListItem[]} options.currentItems All the current
   * distractions.
   * @return {Promise<void>}
   */
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

  /**
   * Handler for when the pomodoro countdown timer started. A toast will be
   * shown when an error occurred.
   * @param {number} startTimestamp The timestamp when the countdown timer
   * started.
   * @return {Promise<void>}
   */
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

  /**
   * Handler for when the pomodoro countdown timer was stopped by the user. A
   * toast will be shown when an error occurred.
   * @return {Promise<void>}
   */
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

  /**
   * Handler for when the pomodoro countdown timer completed. A notification
   * will be displayed to the user if the IDB was successfully updated,
   * otherwise a toast will be shown when an error occurred.
   * @return {Promise<void>}
   */
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

  // Effect used to automatically dismiss the pomodoro complete notification
  // after the user closed the app.
  useEffect(() => {
    if (!completeNotification) return;

    window.addEventListener("beforeunload", onBeforeUnload);

    function onBeforeUnload(event) {
      completeNotification.close();
      delete event.returnValue;
    }

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [completeNotification]);

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
 * element in IDB.
 * @param {string} id The ID of the countdown timer
 * @param {number} startTimestamp The timestamp when the countdown timer
 * started.
 * @return {Promise<string>} Resolves into the ID of the countdown timer
 * @throws {DexieError} If the IDB operation failed
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
 * @throws {DexieError} If the IDB operation failed
 */
async function saveListItems(id, items) {
  return db.table(DATABASE.LIST_ITEMS.STORE).put({
    [DATABASE.LIST_ITEMS.ID]: id,
    [DATABASE.LIST_ITEMS.ITEMS]: items,
  });
}

/**
 * Dismissed the specified alert.
 * @param {string} id The ID of the alert to dismiss.
 * @returns {Promise<string>} If the operation succeeds then resolves to the
 * key under which the alert was stored in the table
 * @throws {DexieError} If the IDB operation failed
 */
async function dismissAlert(id) {
  return db.table(DATABASE.ALERTS.STORE).put({
    [DATABASE.ALERTS.ID]: id,
    [DATABASE.ALERTS.DISMISSED]: true,
  });
}
