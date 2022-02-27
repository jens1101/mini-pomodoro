/**
 *
 * @type {ToastConfig[]}
 */
import { useEffect, useState } from "react";

const toasts = new Set();
const toastStateSetters = new Set();

function syncToastStates() {
  for (const setToastState of toastStateSetters) {
    setToastState(Array.from(toasts));
  }
}

export function useToasts() {
  const [toastState, setToastState] = useState(Array.from(toasts));

  /**
   *
   * @param {ToastConfig} toast
   */
  function showToast(toast) {
    toasts.add(toast);
    syncToastStates();
  }

  /**
   *
   * @param {ToastConfig} toast
   */
  function closeToast(toast) {
    toasts.delete(toast);
    syncToastStates();
  }

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
