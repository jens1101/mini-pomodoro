import React from "react";
import { EditableList } from "./EditableList.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const addDistractionText = (
  <>
    <FontAwesomeIcon icon={faPlus} /> Add
  </>
);

export function App() {
  return (
    <div className={"container"}>
      <EditableList
        placeholder={"Note a distraction"}
        addButton={addDistractionText}
      />
    </div>
  );
}
