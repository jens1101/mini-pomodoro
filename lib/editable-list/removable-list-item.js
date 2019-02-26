/* globals HTMLLIElement */

export class RemovableListItem extends HTMLLIElement {
  constructor () {
    super()

    this._removeButton = document.createElement('button')
    this._removeButton.type = 'button'
    // By default we use the "times" symbol (a.k.a. multiplication sign) as the
    // button text for the remove button. This can be customised
    // by setting the "data-remove-item-text" attribute.
    this._removeButton.textContent = '\u00D7'

    this.appendChild(this._removeButton)

    this._removeButton.addEventListener('click', () => {
      this.remove()
    })
  }

  /**
   * Specifies the observed attributes so that `attributeChangedCallback` will
   * work
   * @return {string[]}
   */
  static get observedAttributes () {
    return ['data-remove-item-text']
  }

  /**
   * Lifecycle callback. Gets called whenever the component's HTML attributes
   * are changed.
   * @param {string} name The name of the attribute that has changed
   * @param {string} oldValue The previous value of the attribute
   * @param {string} newValue The new value of the attribute after the change
   */
  async attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'data-remove-item-text':
        this._removeButton.textContent = newValue
        break
    }
  }
}
