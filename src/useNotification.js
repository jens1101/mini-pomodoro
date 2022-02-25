import { useEffect, useState } from "react";
import { NOTIFICATION_PERMISSION } from "./constants";

export function useNotification() {
  const [permission, setPermission] = useState(Notification.permission);

  /**
   *
   * @param {string} title
   * @param {NotificationOptions} [options]
   * @return {Notification|undefined}
   */
  function showNotification(title, options) {
    if (permission !== NOTIFICATION_PERMISSION.GRANTED) return;

    return new Notification(title, options);
  }

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
