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
export class RemovableListItemElement extends window.HTMLLIElement {
  constructor () {
    super()

    // Create the `<button>` element which will act as the remove button
    this._removeButton = document.createElement('button')
    this._removeButton.type = 'button'
    this._removeButton.classList.add('btn')
    this._removeButton.classList.add('btn-outline-danger')
    this._removeButton.classList.add('btn-sm')
    // By default we use the "times" symbol (a.k.a. multiplication sign) as the
    // button text for the remove button. This can be customised by setting the
    // "data-remove-button-text" attribute.
    this._removeButton.textContent = '\u00D7'
    this.appendChild(this._removeButton)

    this._removeButton.addEventListener('click', () => this.remove())
  }

  /**
   * Specifies the observed attributes so that `attributeChangedCallback` will
   * work
   * @return {string[]}
   */
  static get observedAttributes () {
    // Note that the "data-" prefix was chosen to maintain valid HTML
    return ['data-remove-button-text', 'data-remove-button-html']
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Lifecycle callback. Gets called whenever the component's HTML attributes
   * are changed.
   * @param {string} name The name of the attribute that has changed
   * @param {string} oldValue The previous value of the attribute
   * @param {string} newValue The new value of the attribute after the change
   */
  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'data-remove-button-text':
        this._removeButton.textContent = newValue
        break
      case 'data-remove-button-html':
        this._removeButton.innerHTML = newValue
        break
    }
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

window.customElements.define('removable-li', RemovableListItemElement, {
  extends: 'li'
})
