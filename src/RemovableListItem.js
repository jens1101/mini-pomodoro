import { EVENT_NAMES } from './constants.js'

/**
 * Custom component which extends the HTML `<li>` element so that the list item
 * contains a button that, once clicked, will remove the list item from the
 * view.
 *
 * When the remove button is clicked then a "li-removed" event will be triggered
 * on this element that bubbles.
 *
 * The text that is displayed in the remove button can be customised via the
 * "data-remove-button-text" attribute.
 */
export class RemovableListItem extends window.HTMLLIElement {
  constructor () {
    super()

    // Create the `<button>` element which will act as the remove button
    this._removeButton = document.createElement('button')
    this._removeButton.type = 'button'
    this._removeButton.classList.add('btn')
    this._removeButton.classList.add('btn-outline-danger')
    this._removeButton.classList.add('btn-sm')

    // TODO: this will not automatically update. We can use a mutation observer
    //  to fix this.
    const removeButtonContents = this.querySelector('[slot="remove-button"]')

    if (removeButtonContents) {
      this._removeButton.appendChild(removeButtonContents)
    } else {
      // By default we use the "times" symbol (a.k.a. multiplication sign) as
      // the button text for the remove button.
      this._removeButton.textContent = '\u00D7'
    }

    this.appendChild(this._removeButton)

    this._removeButton.addEventListener('click', () => this.remove())
  }

  remove () {
    const event = new window.CustomEvent(EVENT_NAMES.LI_REMOVED, {
      cancelable: true
    })

    // Dispatch an event that this list item has been removed
    const wasCancelled = !this.dispatchEvent(event)

    // Remove this element if the event was not cancelled.
    if (!wasCancelled) super.remove()
  }
}

window.customElements.define('removable-list-item', RemovableListItem, {
  extends: 'li'
})
