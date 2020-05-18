import { LitElement } from 'lit-element'
import { html } from 'lit-html'
import { bootstrapCssResult } from './lib/bootstrap.js'
import './RemovableListItemElement.js'

/**
 * @typedef EditableListItem
 * @property {string} text
 */

/**
 * @event EditableListItemAdded
 * @type Object
 * @property {EditableListItemEvent} detail
 */

/**
 * @event EditableListItemRemoved
 * @type Object
 * @property {EditableListItemEvent} detail
 */

/**
 * @typedef EditableListItemEvent
 * @property {string} id
 * @property {EditableListItem} item
 * @property {EditableListItem[]} currentItems
 * @property {EditableListItem[]} previousItems
 */

export class EditableListElement extends LitElement {
  constructor () {
    super()

    /** @type {EditableListItem[]} */
    this.items = []
    /** @type {string} */
    this.buttonText = 'Add'
    /** @type {string} */
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
   * A "liadded" custom event will be dispatched on the li element once the
   * item has been added to the list.
   * @fires {EditableListItemAdded}
   * @param {string} text The text to display in the list item.
   */
  addItem (text) {
    const item = { text }
    const previousItems = this.items
    this.items = [...this.items, item]

    /** @type {CustomEvent<EditableListItemEvent>} */
    const event = new window.CustomEvent('liadded', {
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
   * @param {Event} event
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
   * @fires {EditableListItemRemoved}
   * @param {EditableListItem} item
   */
  removeItem (item) {
    const previousItems = this.items
    this.items = this.items.filter(currentItem => currentItem !== item)

    /** @type {CustomEvent<EditableListItemEvent>} */
    const event = new window.CustomEvent('liremoved', {
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
   * @param {CustomEvent} event
   * @param item
   */
  removeItemEventHandler (event, item) {
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
              @liremoved="${event => this.removeItemEventHandler(event, item)}">
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

window.customElements.define('editable-list', EditableListElement)
