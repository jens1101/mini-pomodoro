import { useEffect, useState } from "react";
import { NOTIFICATION_PERMISSION } from "./constants";

/**
 * @typedef {Object} NotificationOptionsWithSound
 * @property {URL|string} [soundUrl]
 * @property {NotificationAction[]} [actions]
 * @property {string} [badge]
 * @property {string} [body]
 * @property {any} [data]
 * @property {NotificationDirection} [dir]
 * @property {string} [icon]
 * @property {string} [image]
 * @property {string} [lang]
 * @property {boolean} [renotify]
 * @property {boolean} [requireInteraction]
 * @property {boolean} [silent]
 * @property {string} [tag]
 * @property {DOMTimeStamp} [timestamp]
 * @property {VibratePattern} [vibrate]
 */

export function useNotification() {
  const [permission, setPermission] = useState(Notification.permission);

  /**
   *
   * @param {string} title
   * @param {NotificationOptionsWithSound} [options]
   * @return {Promise<Notification|undefined>}
   */
  async function showNotification(title, options) {
    if (permission !== NOTIFICATION_PERMISSION.GRANTED) return;

    if (options.soundUrl) {
      options.silent = true;

      const soundUrl =
        options.soundUrl instanceof URL
          ? options.soundUrl.href
          : options.soundUrl;

      const audio = new Audio(soundUrl);
      await audio.play();
    }

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
