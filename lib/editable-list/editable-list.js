/* globals HTMLElement */

import { ComponentHelper } from '../component-helper/main.js'
import { RemovableListItem } from './removable-list-item.js'

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
    return ['remove-button-text']
  }

  /**
   * This constructor sets up the contents of this component and initialises all
   * variables.
   */
  constructor () {
    super()

    // By default we use the "times" symbol (a.k.a. multiplication sign) as the
    // button text for removing items from this list. This can be customised
    // by setting the "remove-button-text" attribute.
    this._removeItemText = '\u00D7'

    const templateUrl = new URL('./editable-list.html', import.meta.url)
    this._setupPromise = ComponentHelper.initWithUrl(this, templateUrl)
      .then(() => {
        this._formElement = this.shadowRoot.querySelector('form')
        this._listElement = this.shadowRoot.querySelector('ul')

        this._formElement.addEventListener('submit', (event) => {
          event.preventDefault()

          // We get access to the input element via the `elements` property of
          // the form element. They key is set to the "name" attribute of the
          // input element.
          const inputElement = this._formElement.elements.item_text
          this.addListItem(inputElement.value)

          this._formElement.reset()
          inputElement.focus()
        })
      })
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
      case 'remove-button-text':
        // We set `_removeItemText` so that all new list items will use this
        this._removeItemText = newValue

        // We update all existing items in the list so that they reflect this
        // change.
        for (const element of this._listElement.children) {
          // Only add the attribute if the child element is indeed a removable
          // list item. Otherwise it will be left alone.
          if (element instanceof RemovableListItem) {
            element.dataset.removeButtonText = this._removeItemText
          }
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
    const liElement = document.createElement('li', {
      is: 'removable-li'
    })

    liElement.dataset.removeButtonText = this._removeItemText

    liElement.textContainer.textContent = text

    this._listElement.appendChild(liElement)
  }
}
