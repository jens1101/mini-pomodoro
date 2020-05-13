import { LitElement } from '../../web_modules/lit-element.js'
import { html } from '../../web_modules/lit-html.js'
import { bootstrapCssResult } from '../app/bootstrap.js'

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
   * @param {Event} event
   */
  addItemCallback (event) {
    event.preventDefault()

    const form = event.target
    // noinspection JSUnresolvedVariable
    const input = form.elements.itemText

    this.addListItem(input.value)

    form.reset()
    input.focus()
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
  addListItem (text) {
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

  render () {
    // FIXME: for some reason this freaks out when I remove an element. I think
    //  it may have to do with the fact that the removable list item removes
    //  itself from the DOM.
    const listItemElements = this.items.map(item => html`
      <li class="list-group-item d-flex align-items-center"
          is="removable-li"
          @liremoved="${() => this.removeItem(item)}">
        <span class="flex-grow-1">${item.text}</span>
      </li>`)

    return html`
      <form @submit="${this.addItemCallback}">
        <div class="input-group">
          <label for="itemText" class="sr-only">${this.placeholder}</label>
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
