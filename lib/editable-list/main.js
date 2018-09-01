/* globals HTMLElement */

import {getTemplate} from '../jt-component/main.js'

/**
 * Custom component which creates a list to which the user can add or remove text items.
 */
export class EditableList extends HTMLElement {
  /**
   * Lifecycle callback. Gets called when the component is added to the document.
   */
  async connectedCallback () {
    this._template = await getTemplate(new URL('./index.html', import.meta.url))

    const rootElement = this._template.elements.get('form-and-list')
    this._formElement = rootElement.querySelector('form')
    this._listElement = rootElement.querySelector('ul')

    this._formElement.addEventListener('submit', (event) => {
      event.preventDefault()

      const inputElement = this._formElement.querySelector('input')
      this.addListItem(inputElement.value)

      this._formElement.reset()
      inputElement.focus()
    })

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(rootElement)
  }

  /**
   * Adds an item to the list. Each list item will automatically have a delete button to remove the
   * item from the list.
   * @param {string} text The text to display in the list item.
   */
  addListItem (text) {
    const liElement = this._createListItemElement()

    liElement.querySelector('span').textContent = text
    liElement.querySelector('button')
      .addEventListener('click', () => liElement.remove())

    this._listElement.appendChild(liElement)
  }

  /**
   * Creates a new list item element
   *
   * @private
   * @return [HTMLElement] an element that is used internally to populate the
   * list.
   */
  _createListItemElement () {
    return this._template.elements.get('list-item').cloneNode(true)
      .firstElementChild
  }
}
