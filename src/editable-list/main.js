import { EditableListElement } from './EditableListElement.js'
import { RemovableListItem } from './RemovableListItem.js'

window.customElements.define('editable-list', EditableListElement)
window.customElements.define('removable-li', RemovableListItem, {
  extends: 'li'
})
