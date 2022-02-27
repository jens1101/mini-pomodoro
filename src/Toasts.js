import {
  faCheckCircle,
  faCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toast, ToastContainer } from "react-bootstrap";
import { useToasts } from "./useToasts";

/**
 * All the configuration necessary for a toast.
 * @typedef ToastConfig
 * @property {TOAST_TYPES} type
 * @property {string|JSX.Element} headerText
 * @property {string|JSX.Element} bodyText
 */

/**
 * Triggered whenever a toast has been closed by the user
 * @callback Toasts~onClose
 * @param {ToastConfig} toast
 */

/**
 * All the available toast types. Each type will add a different styling to the
 * toast.
 * @readonly
 * @enum {string}
 */
export const TOAST_TYPES = {
  DEFAULT: "default",
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
};

/**
 *
 * @return {JSX.Element}
 */
export function Toasts() {
  const { toasts, closeToast } = useToasts();

  return (
    <ToastContainer
      position={"top-end"}
      className={"m-3"}
      style={{ zIndex: "1060" }}
    >
      {toastsToJsx(toasts, closeToast)}
    </ToastContainer>
  );
}

/**
 * @param {ToastConfig[]} toasts
 * @param {Toasts~onClose} onCloseCallback
 * @return {JSX.Element[]}
 */
function toastsToJsx(toasts, onCloseCallback) {
  return toasts.map((toast, index) => {
    const icon = getToastIcon(toast);
    const textClass = getToastTextClass(toast);

    return (
      <Toast onClose={() => onCloseCallback(toast)} key={index}>
        <Toast.Header>
          <FontAwesomeIcon icon={icon} className={`me-1 ${textClass}`} />
          <strong className={`me-auto ${textClass}`}>{toast.headerText}</strong>
        </Toast.Header>
        <Toast.Body>{toast.bodyText}</Toast.Body>
      </Toast>
    );
  });
}

/**
 *
 * @param {ToastConfig} toast
 * @return {IconDefinition}
 */
function getToastIcon(toast) {
  switch (toast.type) {
    case TOAST_TYPES.DANGER:
      return faTimesCircle;
    case TOAST_TYPES.INFO:
      return faInfoCircle;
    case TOAST_TYPES.SUCCESS:
      return faCheckCircle;
    case TOAST_TYPES.WARNING:
      return faExclamationCircle;
    case TOAST_TYPES.DEFAULT:
    default:
      return faCircle;
  }
}

/**
 *
 * @param {ToastConfig} toast
 * @return {string}
 */
function getToastTextClass(toast) {
  switch (toast.type) {
    case TOAST_TYPES.DANGER:
      return "text-danger";
    case TOAST_TYPES.INFO:
      return "text-info";
    case TOAST_TYPES.SUCCESS:
      return "text-success";
    case TOAST_TYPES.WARNING:
      return "text-warning";
    case TOAST_TYPES.DEFAULT:
    default:
      return "";
  }
}
