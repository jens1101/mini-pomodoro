import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

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
 * @callback listChangedCallback
 * @param {EditableListChanges} detail All the changes that occurred due to
 * this event.
 */

/**
 * A component that allows users to add and remove items to and from a list. The
 * items are ordered alphabetically according to the user's current locale with
 * an awareness for numerical prefixes.
 *
 * Note that this doesn't keep an internal state of the list items. Instead,
 * the displayed list items are taken from the props.
 * @param {Object} props
 * @param {string} props.placeholder The placeholder to display in the text
 * input element.
 * @param {EditableListItem[]} props.items All the list items to display to the
 * user.
 * @param {string|JSX.Element} props.addButtonText The text or component to
 * display in the add item button.
 * @param {string|JSX.Element} props.removeButtonText The text or component to
 * display in the remove item button.
 * @param {listChangedCallback} props.onAdd Callback when a new item was added
 * to the list.
 * @param {listChangedCallback} props.onRemove Callback when an item was removed
 * from the list
 * @return {JSX.Element}
 */
export function EditableList({
  placeholder = "",
  items = [],
  addButtonText = "",
  removeButtonText = "",
  onAdd = () => {},
  onRemove = () => {},
}) {
  /**
   * The current text that is entered for a new list item.
   * @type {[string, function(string)]}
   */
  const [itemText, setItemText] = useState("");

  /**
   * The sorted list of items that will be rendered on screen.
   * @type {JSX.Element[]}
   */
  const listItemsJsx = items
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
          <FontAwesomeIcon icon={faTimes} />
          {removeButtonText}
        </button>
      </li>
    ));

  /**
   * Handler function that gets triggered when the user removes an item from the
   * list. This calls the `onRemove` callback.
   * @param {EditableListItem} item The item that was removed.
   */
  function removeItem(item) {
    const currentItems = items.filter((currentItem) => currentItem !== item);
    const previousItems = items;

    onRemove({
      item,
      currentItems,
      previousItems,
    });
  }

  /**
   * Handler function that gets triggered when the "new list item" form gets
   * submitted. This prevents the default form behaviour and calls the `onAdd`
   * callback.
   * @param {SubmitEvent} event
   */
  function handleSubmit(event) {
    event.preventDefault();

    /** @type {EditableListItem} */
    const item = { text: itemText };
    /** @type {EditableListItem[]} */
    const currentItems = [...items, item];
    /** @type {EditableListItem[]} */
    const previousItems = items;

    // Clear the form.
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
          <button className={"btn btn-primary"} type={"submit"}>
            <FontAwesomeIcon icon={faPlus} />
            {` ${addButtonText}`}
          </button>
        </div>
      </form>

      <ul className={"list-group list-group-flush"}>{listItemsJsx}</ul>
    </>
  );
}
