import { html } from '../../web_modules/lit-html.js'

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
  const listItemElements = listItems.map(item => html`
    <li class="list-group-item d-flex align-items-center"
        is="removable-li">
      <span class="flex-grow-1">${item}</span>
    </li>`)

  return html`
    <form @submit="${options.addItemCallback}">
      <div class="input-group">
        <input type="text"
               class="form-control"
               placeholder="${itemTextPlaceholder}"
               name="itemText"
               required>
        <div class="input-group-append">
          <button class="btn btn-primary" type="submit">
            ${addButtonText}
          </button>
        </div>
      </div>
    </form>

    <ul class="list-group list-group-flush">
      ${listItemElements}
    </ul>
  `
}
