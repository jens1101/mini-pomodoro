/* globals HTMLLIElement, CustomEvent */

/**
 * Custom component which extends the HTML `<li>` element so that the list item
 * contains a button that, once clicked, will remove the list item from the
 * view.
 *
 * When the remove button is clicked then a "liremoved" event will be triggered
 * on this element that bubbles.
 *
 * The text that is displayed in the remove button can be customised via the
 * "data-remove-button-text" attribute.
 */
export class RemovableListItem extends HTMLLIElement {
  constructor () {
    super()

    this._dbId = null

    // Set the "is" attribute. This doesn't always happen automatically, so
    // we just want to be sure.
    this.setAttribute('is', 'removable-li')

    // Create a `<span>` element which will act as a container for the text of
    // this list item
    this._textContainer = document.createElement('span')
    // Migrate all the nodes from this list element to the text container. This
    // could've been done more elegantly via slots, but unfortunately slots
    // require a shadow DOM which is not supported on this element.
    while (this.childNodes.length) {
      this._textContainer.appendChild(this.childNodes[0])
    }
    this.appendChild(this._textContainer)

    // Create the `<button>` element which will act as the remove button
    this._removeButton = document.createElement('button')
    this._removeButton.type = 'button'
    this._removeButton.classList.add('btn')
    this._removeButton.classList.add('btn--inline')
    // By default we use the "times" symbol (a.k.a. multiplication sign) as the
    // button text for the remove button. This can be customised by setting the
    // "data-remove-button-text" attribute.
    this._removeButton.textContent = '\u00D7'
    this.appendChild(this._removeButton)

    this._removeButton.addEventListener('click', () => {
      // Dispatch an event that this list item has been removed
      const event = new CustomEvent('liremoved', {
        bubbles: true,
        composed: true,
        detail: { dbId: this.dbId }
      })
      this.dispatchEvent(event)

      // Remove this element. This is done after the event dispatch, otherwise
      // the event won't bubble.
      this.remove()
    })
  }

  /**
   * Specifies the observed attributes so that `attributeChangedCallback` will
   * work
   * @return {string[]}
   */
  static get observedAttributes () {
    // Note that the "data-" prefix was chosen to maintain valid HTML
    return ['data-remove-button-text']
  }

  get text () {
    return this._textContainer.textContent
  }

  set text (text) {
    this._textContainer.textContent = text
  }

  get dbId () {
    return this._dbId
  }

  set dbId (id) {
    if (!Number.isInteger(id)) {
      throw new TypeError('Key ID must be an integer')
    }

    if (this._dbId == null) {
      this._dbId = id
    } else {
      throw new Error(`Key ID already set for list item #${this.dbId}`)
    }
  }

  /**
   * Lifecycle callback. Gets called whenever the component's HTML attributes
   * are changed.
   * @param {string} name The name of the attribute that has changed
   * @param {string} oldValue The previous value of the attribute
   * @param {string} newValue The new value of the attribute after the change
   */
  async attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data-remove-button-text') {
      this._removeButton.textContent = newValue
    }
  }
}
