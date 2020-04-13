import { html } from 'lit-html'

/**
 * @typedef {Object} EditableListTemplateOptions
 * @property {string} [itemTextPlaceholder]
 * @property {string} [addButtonText]
 * @property {EventCallback} [addItemCallback]
 */

/**
 *
 * @param {string[]} listItems
 * @param {EditableListTemplateOptions} options
 * @return {TemplateResult}
 */
export function template (listItems, options) {
  const itemTextPlaceholder = options.itemTextPlaceholder || 'Add an item'
  const addButtonText = options.addButtonText || 'Add'

  // TODO: implement the remove-li component
  const listItemElements = listItems.map(item => html`
    <li is="removable-li">${item}</li>
  `)

  return html`
    <form @submit="${options.addItemCallback}">
      <div class="input-group">
        <input type="text"
               class="form-control"
               placeholder="${itemTextPlaceholder}"
               name="itemText"
               required>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">
            ${addButtonText}
          </button>
        </div>
      </div>
    </form>

    <ul>${listItemElements}</ul>
  `
}
