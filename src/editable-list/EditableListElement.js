import { LitElement } from 'lit-element'
import { bootstrapCssResult } from '../app/bootstrap.js'
import { template } from './template.js'

export class EditableListElement extends LitElement {
  constructor () {
    super()

    this.items = []
  }

  static get properties () {
    return {
      items: { type: Array }
    }
  }

  static get styles () {
    return [bootstrapCssResult]
  }

  render () {
    return template(this.items, {
      addItemCallback: this.addItemCallback
    })
  }

  /**
   * @param {Event} event
   */
  addItemCallback (event) {
    event.preventDefault()

    const form = event.target
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
   * @param {string} text The text to display in the list item.
   */
  addListItem (text) {
    this.items = [...this.items, text]

    const event = new window.CustomEvent('liadded', {
      bubbles: true
    })
    this.dispatchEvent(event)
  }
}