import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { CountdownTimer } from "./CountdownTimer.js";
import { EditableList } from "./EditableList.js";
import { ToastContainer } from "./ToastContainer.js";

const addDistractionText = (
  <>
    <FontAwesomeIcon icon={faPlus} /> Add
  </>
);

export function App() {
  const [
    /** @type {ToastConfig[]} */
    toasts,
    /** @type {Function<ToastConfig[]>} */
    setToasts,
  ] = useState([]);

  function onToastClose(toast) {
    setToasts(toasts.filter((currentToast) => currentToast !== toast));
  }

  return (
    <div className={"container"}>
      <CountdownTimer
        isRunning={true}
        currentDurationMs={1000}
        totalDurationMs={5000}
      />

      <EditableList
        placeholder={"Note a distraction"}
        addButton={addDistractionText}
      />

      <ToastContainer toasts={toasts} onClose={onToastClose} />
    </div>
  );
}
