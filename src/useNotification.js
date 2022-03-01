import { useEffect, useState } from "react";
import { NOTIFICATION_PERMISSION } from "./constants";

/**
 * @typedef {Object} NotificationHook
 * @property {boolean} isPermissionGranted Whether or not notification
 * permission has been granted.
 * @property {boolean} shouldAskForPermission True if the notification
 * permission still has its default value. In this case the user should be
 * asked
 * for notification permission.
 * @property {Function} showNotification Convenience function to show a new
 * notification.
 */

/**
 * Hook to show notifications and manage notification permissions.
 * @return {NotificationHook}
 * @see {@link useEnvironment~changeEnvironment} for documentation about showing
 * a notification
 */
export function useNotification() {
  const [permission, setPermission] = useState(Notification.permission);

  /**
   * Show a new notification to the user. Returns the Notification instance if
   * permission was granted or undefined if not.
   * @memberOf useNotification
   * @param {string} title The title to show in the notification.
   * @param {NotificationOptions} [options] All additional optional options to
   * pass to the Notification instance.
   * @return {Notification|undefined} The Notification instance if permission
   * was granted or undefined otherwise.
   */
  function showNotification(title, options) {
    if (permission !== NOTIFICATION_PERMISSION.GRANTED) return;

    return new Notification(title, options);
  }

  // Effect to automatically request notification permission if it hasn't been
  // set yet.
  useEffect(() => {
    if (permission !== NOTIFICATION_PERMISSION.DEFAULT) return;

    let isMounted = true;

    Notification.requestPermission().then((permission) => {
      if (!isMounted) return;

      setPermission(permission);
    });

    return () => {
      isMounted = false;
    };
  }, [permission]);

  return {
    showNotification,
    isPermissionGranted: permission === NOTIFICATION_PERMISSION.GRANTED,
    shouldAskForPermission: permission === NOTIFICATION_PERMISSION.DEFAULT,
  };
}
