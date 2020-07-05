import React from "react";
import "./App.css";
import { EditableList } from "./EditableList.js";

export function App() {
  return (
    <div className={"container"}>
      <EditableList placeholder={"Note a distraction"} />
    </div>
  );
}
