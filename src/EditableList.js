import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

/**
 * An object that represents an item in the editable list element.
 * @typedef EditableListItem
 * @property {string} text
 */

/**
 * Details all the changes that occurred to an editable list.
 * @typedef EditableListChanges
 * @property {EditableListItem} item The list item that was changed.
 * @property {EditableListItem[]} currentItems All the items in the list after
 * the change.
 * @property {EditableListItem[]} previousItems All the items in the list
 * before the change.
 */

/**
 *
 * @callback listChangedCallback
 * @param {EditableListChanges} detail All the changes that occurred due to
 * this event.
 */

/**
 *
 * @param {string} placeholder The placeholder to display in the text input element.
 * @param {EditableListItem[]} items
 * @param {JSX.Element} addButton The text or component to display in the add item button.
 * @param {JSX.Element} removeButton The text or component to display in the remove item button.
 * @param {listChangedCallback} onAdd
 * @param {listChangedCallback} onRemove
 * @return {JSX.Element}
 * @constructor
 */
export function EditableList({
  placeholder = "",
  items = [],
  addButton = <FontAwesomeIcon icon={faPlus} />,
  removeButton = <FontAwesomeIcon icon={faTimes} />,
  onAdd = () => {},
  onRemove = () => {},
}) {
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
          {removeButton}
        </button>
      </li>
    ));

  function removeItem(item) {
    const currentItems = items.filter((currentItem) => currentItem !== item);
    const previousItems = items;

    onRemove({
      item,
      currentItems,
      previousItems,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const item = { text: itemText };
    const currentItems = [...items, item];
    const previousItems = items;

    setItemText("");

    onAdd({
      item,
      currentItems,
      previousItems,
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"itemText"} className={"sr-only"}>
          {placeholder}
        </label>
        <div className={"input-group"}>
          <input
            autoFocus={true}
            type={"text"}
            className={"form-control"}
            placeholder={placeholder}
            id={"itemText"}
            required={true}
            value={itemText}
            onChange={(event) => setItemText(event.target.value)}
          />
          <div className={"input-group-append"}>
            <button className={"btn btn-primary"} type={"submit"}>
              {addButton}
            </button>
          </div>
        </div>
      </form>

      <ul className={"list-group list-group-flush"}>{listItems}</ul>
    </>
  );
}
