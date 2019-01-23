/* globals HTMLLIElement */

import { ComponentHelper } from '../component-helper/component-helper'

export class RemovableListItem extends HTMLLIElement {
  constructor () {
    super()

    const templateUrl = new URL('./removable-list-item.html', import.meta.url)
    this._setupPromise = ComponentHelper.initWithUrl(this, templateUrl)
      .then(() => {
        this._removeButton = this.shadowRoot.querySelector('button')
        this._listElement = this.shadowRoot.querySelector('ul')

        this._formElement.addEventListener('submit', (event) => {
          event.preventDefault()

          const inputElement = this._formElement.querySelector('input')
          this.addListItem(inputElement.value)

          this._formElement.reset()
          inputElement.focus()
        })
      })
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

    liElement.textContent = text

    this._listElement.appendChild(liElement)
  }
}
