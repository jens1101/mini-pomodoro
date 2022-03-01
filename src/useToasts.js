import { useEffect, useState } from "react";

/**
 * @typedef {Object} ToastHook
 * @property {ToastConfig[]} toasts Array of all the toasts that are currently
 * displayed.
 * @property {Function} showToast Function to show a new toast.
 * @property {Function} closeToast Function to close an existing toast.
 */

/**
 * All the toasts that are currently displayed in the app.
 * @type {Set<ToastConfig>}
 */
const toasts = new Set();

/**
 * All the state setter functions for all the components that are using the
 * `useToasts` hook.
 * @type {Set<function(ToastConfig[])>}
 */
const toastStateSetters = new Set();

/**
 * Convenience function to call all the state setter functions with the latest
 * toasts.
 */
function syncToastStates() {
  for (const setToastState of toastStateSetters) {
    setToastState(Array.from(toasts));
  }
}

/**
 * Hook used to show, hide, and manage toasts.
 *
 * Toasts are messages that are displayed in app, as opposed to notifications
 * that are displayed by the host OS.
 * @return {ToastHook}
 * @see {@link useToasts~showToast} for documentation about showing a toast.
 * @see {@link useToasts~closeToast} for documentation about closing a toast.
 */
export function useToasts() {
  /**
   * The toast state for this hook. This will be kept in sync with the set of
   * toasts above.
   * @type {[ToastConfig[], function(ToastConfig[])]}
   */
  const [toastState, setToastState] = useState(Array.from(toasts));

  /**
   * Show a new toast.
   * @memberOf useToasts
   * @param {ToastConfig} toast The config of the toast to show to the user.
   */
  function showToast(toast) {
    toasts.add(toast);
    syncToastStates();
  }

  /**
   * Close an existing toast. If the specified toast could not be found then
   * nothing will happen.
   * @memberOf useToasts
   * @param {ToastConfig} toast The config of the toast to close.
   */
  function closeToast(toast) {
    if (!toasts.has(toast)) return;

    toasts.delete(toast);
    syncToastStates();
  }

  // Effect responsible for adding and removing the state setter function to the
  // set of setter functions.
  useEffect(() => {
    toastStateSetters.add(setToastState);

    return () => {
      toastStateSetters.delete(setToastState);
    };
  }, []);

  return {
    showToast,
    closeToast,
    toasts: toastState,
  };
}
