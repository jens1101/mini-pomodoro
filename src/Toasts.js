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
 * @property {TOAST_TYPES} type The type of this toast. This will affect its
 * appearance.
 * @property {string|JSX.Element} headerText The text to display in the header
 * of the toast.
 * @property {string|JSX.Element} bodyText The text to display in the body of
 * the toast.
 */

/**
 * Triggered whenever a toast has been closed by the user
 * @callback Toasts~onClose
 * @param {ToastConfig} toast The toast that was closed.
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
 * Component responsible for displaying toasts.
 *
 * It's not possible to show and hide toasts via this component. Instead, use
 * the {@link useToasts} hook.
 * @return {JSX.Element}
 */
export function Toasts() {
  const { toasts, closeToast } = useToasts();

  /**
   * The JSX for all the toasts that will be displayed to the user.
   * @type {JSX.Element[]}
   */
  const toastsJsx = toasts.map((toast, index) => {
    const icon = getToastIcon(toast);
    const textClass = getToastTextClass(toast);

    return (
      <Toast onClose={() => closeToast(toast)} key={index}>
        <Toast.Header>
          <FontAwesomeIcon icon={icon} className={`me-1 ${textClass}`} />
          <strong className={`me-auto ${textClass}`}>{toast.headerText}</strong>
        </Toast.Header>
        <Toast.Body>{toast.bodyText}</Toast.Body>
      </Toast>
    );
  });

  return (
    <ToastContainer
      position={"top-end"}
      className={"m-3"}
      style={{ zIndex: "1060" }}
    >
      {toastsJsx}
    </ToastContainer>
  );
}

/**
 * Returns the applicable Fontawesome icon definition for the specified toast.
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
 * Returns the applicable text class for the specified toast.
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
