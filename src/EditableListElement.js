import { LitElement } from 'lit-element'
import { html } from 'lit-html'
import { EVENT_NAMES } from './app/constants.js'
import { bootstrapCssResult } from './lib/bootstrap.js'
import './RemovableListItemElement.js'

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
 * @property {string} id The HTML ID of the editable list that was changed.
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
export class EditableListElement extends LitElement {
  constructor () {
    super()

    /**
     * All the items currently in this list.
     * @type {EditableListItem[]}
     */
    this.items = []

    /**
     * The text to display in the add button.
     * @type {string}
     */
    this.buttonText = 'Add'

    /**
     * The placeholder to display in the text input element.
     * @type {string}
     */
    this.placeholder = 'Add an item'
  }

  static get properties () {
    return {
      items: { type: Array },
      buttonText: { type: String },
      placeholder: { type: String }
    }
  }

  static get styles () {
    return [bootstrapCssResult]
  }

  /**
   * Adds an item to the list. Each list item will automatically have a delete
   * button to remove the item from the list.
   *
   * A "li-added" custom event will be dispatched on the li element once the
   * item has been added to the list.
   * @fires {EditableListItemAdded}
   * @param {string} text The text to display in the list item.
   */
  addItem (text) {
    const item = { text }
    const previousItems = this.items
    this.items = [...this.items, item]

    /** @type {CustomEvent<EditableListChanges>} */
    const event = new window.CustomEvent(EVENT_NAMES.LI_ADDED, {
      detail: {
        id: this.id,
        item,
        currentItems: this.items,
        previousItems
      }
    })
    this.dispatchEvent(event)
  }

  /**
   * The event handler for when the add item form is submitted. This adds the
   * new item to the list, resets the form, and focuses the input element.
   * @param {Event} event
   * @see {addItem} The function that adds a new item to the list.
   */
  addItemEventHandler (event) {
    event.preventDefault()

    const form = event.target
    // noinspection JSUnresolvedVariable
    const input = form.elements.itemText

    this.addItem(input.value)

    form.reset()
    input.focus()
  }

  /**
   * Removes the specified item from the list and fires an event once the item
   * has been removed. The event still gets fired even if the item wasn't found
   * in the list.
   *
   * @fires {EditableListItemRemoved}
   * @param {EditableListItem} item The item that needs to be removed.
   */
  removeItem (item) {
    const previousItems = this.items
    this.items = this.items.filter(currentItem => currentItem !== item)

    /** @type {CustomEvent<EditableListChanges>} */
    const event = new window.CustomEvent(EVENT_NAMES.LI_REMOVED, {
      detail: {
        id: this.id,
        item,
        currentItems: this.items,
        previousItems
      }
    })
    this.dispatchEvent(event)
  }

  /**
   * The event handler for when an item is being removed from the list.
   *
   * @param {CustomEvent} event
   * @param {EditableListItem} item The item that is being removed.
   * @see {removeItem} The function that removes the item from the list.
   */
  removeItemEventHandler (event, item) {
    // We prevent the default action of the removable list item, otherwise it
    // will remove itself from the DOM and bring the array of items out of sync
    // with the DOM.
    event.preventDefault()

    this.removeItem(item)
  }

  render () {
    const listItemElements = this.items
      .concat([])
      .sort((a, b) => a.text.localeCompare(b.text, undefined, { numeric: true }))
      .map(item => {
        return html`
          <li class="list-group-item d-flex align-items-center"
              is="removable-li"
              @li-removed="${event => this.removeItemEventHandler(event, item)}">
            <span class="flex-grow-1">${item.text}</span>
          </li>`
      })

    return html`
      <form @submit="${this.addItemEventHandler}">
        <label for="itemText" class="sr-only">${this.placeholder}</label>
        <div class="input-group">
          <input type="text"
                 class="form-control"
                 placeholder="${this.placeholder}"
                 name="itemText"
                 id="itemText"
                 required>
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit">
              ${this.buttonText}
            </button>
          </div>
        </div>
      </form>

      <ul class="list-group list-group-flush">
        ${listItemElements}
      </ul>`
  }
}

// Register the custom element.
window.customElements.define('editable-list', EditableListElement)
