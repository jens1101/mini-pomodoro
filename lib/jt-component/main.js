/* global fetch, DOMParser */

/**
 * @param {(URL|string)} templateUrl The URL to the template HTML document.
 */
export async function getTemplate (templateUrl) {
  // TODO: maybe cache or memorise this.
  const response = await fetch(templateUrl)
  const htmlText = await response.text()

  const templateDocument = (new DOMParser())
    .parseFromString(htmlText, 'text/html')

  const templateElements = new TemplateList()
  /**
   * Contains the first element in the templateElements map. If not templates
   * were found then this is undefined instead.
   * This is a convenient shortcut when your template document only contains one
   * tempalte.
   * @type {(HTMLElement|undefined)}
   */
  let firstTemplateElement
  Array.from(templateDocument.querySelectorAll('template'))
    .forEach((template, index) => {
      const element = template.content.cloneNode(true)
      templateElements.set(index, element)
      firstTemplateElement = firstTemplateElement || element

      if (template.id) {
        templateElements.set(template.id, element)
      }
    })

  /**
   * Contains a copy of the style sheet from the template document. If no style
   * sheet was found then this is undefined instead.
   * @type {(HTMLElement|undefined)}
   */
  const templateStylesheet = (() => {
    const sheet = templateDocument.querySelector('link[rel="stylesheet"]')
    if (sheet) { return sheet.cloneNode(true) }
  })()

  return {
    document: templateDocument,
    elements: templateElements,
    element: firstTemplateElement,
    stylesheet: templateStylesheet
  }
}

class TemplateList extends Map {
  /**
   * This iterator will only loop through the unique templates. This is
   * necessary, because we may have duplicates in this map, because we map
   * templates by their index and ID (if it has one).
   */
  * [Symbol.iterator] () {
    for (let [key, value] of this.entries()) {
      if (Number.isInteger(key)) {
        yield [key, value]
      }
    }
  }
}
