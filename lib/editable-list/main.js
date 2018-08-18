/* globals HTMLElement */

import {getTemplate} from '../jt-component/main.js'

export class EditableList extends HTMLElement {
  async connectedCallback () {
    this._template = await getTemplate('./lib/editable-list/index.html')

    const rootElement = this._template.elements.get('form-and-list')
    this._formElement = rootElement.querySelector('form')
    this._listElement = rootElement.querySelector('ul')

    this._formElement.addEventListener('submit', (event) => {
      event.preventDefault()

      const inputElement = this._formElement.querySelector('input')
      this.addDistraction(inputElement.value)

      this._formElement.reset()
      inputElement.focus()
    })

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(rootElement)
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

  addDistraction (distraction) {
    // TODO: add an auto-complete feature based on what this function recieved.
    const liElement = this._createListItemElement()

    liElement.querySelector('span').textContent = distraction
    liElement.querySelector('button')
      .addEventListener('click', () => liElement.remove())

    this._listElement.appendChild(liElement)
  }
}
