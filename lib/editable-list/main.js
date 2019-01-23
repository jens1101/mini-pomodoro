/* globals customElements */

import { RemovableListItem } from './removable-list-item.js'
import { EditableList } from './editable-list.js'

customElements.define('removable-li', RemovableListItem, {
  extends: 'li'
})
customElements.define('editable-list', EditableList)
