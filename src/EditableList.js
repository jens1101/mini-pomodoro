import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

/**
 *
 * @param {Object} props
 * @param {string} props.placeholder The placeholder to display in the text
 * input element.
 * @param {string|React.Component} [props.addButton] The text or
 * component to display in the add item button.
 * @param {string|React.Component} [props.removeButton] The text or
 * component to display in the remove item button.
 * @returns {*}
 */
export function EditableList(props) {
  const [items, setItems] = useState([]);
  const [itemText, setItemText] = useState("");

  const listItems = items
    .concat([])
    .sort((a, b) => a.text.localeCompare(b.text, undefined, { numeric: true }))
    .map((item, index) => (
      <li className={"list-group-item d-flex align-items-center"} key={index}>
        <span className={"flex-grow-1"}>{item.text}</span>
        <button
          type={"button"}
          className={"btn btn-outline-danger btn-sm"}
          onClick={() => removeItem(item)}
          title={"Remove item"}
        >
          {props.removeButton || <FontAwesomeIcon icon={faTimes} />}
        </button>
      </li>
    ));

  function removeItem(item) {
    setItems(items.filter((currentItem) => currentItem !== item));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setItems([...items, { text: itemText }]);
    setItemText("");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"itemText"} className={"sr-only"}>
          {props.placeholder}
        </label>
        <div className={"input-group"}>
          <input
            autoFocus={true}
            type={"text"}
            className={"form-control"}
            placeholder={props.placeholder}
            id={"itemText"}
            required={true}
            value={itemText}
            onChange={(event) => setItemText(event.target.value)}
          />
          <div className={"input-group-append"}>
            <button className={"btn btn-primary"} type={"submit"}>
              {props.addButton || <FontAwesomeIcon icon={faPlus} />}
            </button>
          </div>
        </div>
      </form>

      <ul className={"list-group list-group-flush"}>{listItems}</ul>
    </>
  );
}
