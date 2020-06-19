import { dispatch, html } from 'hybrids'
import { EVENT_NAMES } from './constants.js'
import './RemovableListItem.js'
import fontAwesome from '@fortawesome/fontawesome-free/css/all.min.css'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import common from './assets/styles/common.css'

/**
 * An object that represents an item in the editable list element.
 * @typedef EditableListItem
 * @property {string} text
 */

/**
 * Event that gets triggered whenever a new item was added to the editable list.
 * @event EditableListItemAdded
 * @type Object
 * @property {EditableListChanges} detail All the changes that occurred due to
 * this event.
 */

/**
 * Event that gets triggered whenever an item was removed from the editable
 * list.
 * @event EditableListItemRemoved
 * @type Object
 * @property {EditableListChanges} detail All the changes that occurred due to
 * this event.
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
 * An unordered list where you can add and remove list items to. The items,
 * add button test, and placeholder text can be customised.
 */
export const EditableList = {
  /**
   * All the items currently in this list.
   * @type {EditableListItem[]}
   */
  items: [],
  /**
   * The placeholder to display in the text input element.
   * @type {string}
   */
  placeholder: 'Add an item',
  render: ({ items, placeholder }) => {
    const listItemElements = items
      .concat([])
      .sort((a, b) => a.text.localeCompare(b.text, undefined, { numeric: true }))
      .map(item => {
        function removeItemEventHandler (host, event) {
          event.preventDefault()

          removeItem(host, item)
        }

        return html`
          <li class="list-group-item d-flex align-items-center"
              is="removable-list-item"
              li-removed="${removeItemEventHandler}">
            <span class="flex-grow-1">${item.text}</span>
            <span class="fas fa-times" slot="remove-button"></span>
          </li>`
      })

    html`
      <form onsubmit="${addItem}">
          <label for="itemText" class="sr-only">${placeholder}</label>
          <div class="input-group">
            <input type="text"
                   class="form-control"
                   placeholder="${placeholder}"
                   name="itemText"
                   id="itemText"
                   required>
            <div class="input-group-append">
              <button class="btn btn-primary" type="submit">
                <slot name="add-button">Add</slot>
              </button>
            </div>
          </div>
        </form>

        <ul class="list-group list-group-flush">
          ${listItemElements}
        </ul>
    `.style(bootstrap, fontAwesome, common)
  }
}

/**
 * The event handler for when the add item form is submitted. This adds the
 * new item to the list, resets the form, and focuses the input element.
 */
function addItem (host, event) {
  event.preventDefault()

  const form = event.target
  // noinspection JSUnresolvedVariable
  const input = form.elements.itemText

  const item = { text: input.value }
  const previousItems = host.items
  host.items = [...host.items, item]

  form.reset()
  input.focus()

  dispatch(host, EVENT_NAMES.LI_ADDED, {
    detail: {
      item,
      currentItems: host.items,
      previousItems
    }
  })
}

/**
 * Removes the specified item from the list and fires an event once the item
 * has been removed. The event still gets fired even if the item wasn't found
 * in the list.
 *
 * @fires {EditableListItemRe`moved}
 */
function removeItem (host, item) {
  const previousItems = host.items
  host.items = host.items.filter(currentItem => currentItem !== item)

  dispatch(host, EVENT_NAMES.LI_REMOVED, {
    detail: {
      item,
      currentItems: host.items,
      previousItems
    }
  })
}
