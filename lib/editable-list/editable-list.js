/* globals HTMLElement */

import { Template } from '../component/main.js'

/**
 * Custom component which creates a list to which the user can add or remove
 * text items.
 */
export class EditableList extends HTMLElement {
  /**
   * Specifies the observed attributes so that `attributeChangedCallback` will
   * work
   * @return {string[]}
   */
  static get observedAttributes () {
    return ['add-item-text', 'remove-item-text']
  }

  /**
   * This constructor sets up the contents of this component and initialises all
   * variables.
   */
  constructor () {
    super()

    // By default we use the "times" symbol (a.k.a. multiplication sign) as the
    // button text for removing items from this list. This can be customised
    // by setting the "remove-item-text" attribute.
    this._removeItemText = '\u00D7'

    const templateUrl = new URL('./index.html', import.meta.url)
    // This promise is used to wait for the setup to finish.
    this._setupPromise = this._setupTemplate(templateUrl)
  }

  /**
   * Lifecycle callback. Gets called whenever the component's HTML attributes
   * are changed.
   * @param {string} name The name of the attribute that has changed
   * @param {string} oldValue The previous value of the attribute
   * @param {string} newValue The new value of the attribute after the change
   */
  async attributeChangedCallback (name, oldValue, newValue) {
    // We need to wait for this component to finish setup, because we may need
    // to access elements of this component below.
    await this._setupPromise

    switch (name) {
      case 'add-item-text':
        this._formElement.querySelector('button[type="submit"]')
          .textContent = newValue
        break
      case 'remove-item-text':
        // We set `_removeItemText` so that all new list items will use this
        this._removeItemText = newValue

        // We update all existing items in the list so that they reflect this
        // change.
        for (const button of this._listElement.querySelectorAll('button')) {
          button.textContent = newValue
        }
        break
    }
  }

  /**
   * Adds an item to the list. Each list item will automatically have a delete
   * button to remove the item from the list.
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
   * Gets the template for the current component and does any necessary setup.
   * This includes creating and attaching the shadow root.
   * @param {(Url|string)} templateUrl
   * @return {ShadowRoot}
   */
  async _setupTemplate (templateUrl) {
    this._template = await Template.initWithUrl(templateUrl)

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

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(rootElement)

    return shadowRoot
  }

  /**
   * Creates a new list item element
   *
   * @private
   * @return [HTMLElement] an element that is used internally to populate the
   * list.
   */
  _createListItemElement () {
    const listItem = this._template.elements.get('list-item').cloneNode(true)
      .firstElementChild
    listItem.querySelector('button').textContent = this._removeItemText

    return listItem
  }
}