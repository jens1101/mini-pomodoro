/* global fetch, DOMParser */

export async function getTemplate (templateUrl) {
  // TODO: maybe cache or memorise this.
  const response = await fetch(templateUrl)
  const htmlText = await response.text()

  const templateDocument = (new DOMParser())
    .parseFromString(htmlText, 'text/html')

  const templateElements = new TemplateList()
  /**
   * Contains the first element in the templateElements map. This is a
   * convenient shortcut when your template document only contains one tempalte
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

  const templateStylesheet = templateDocument
    .querySelector('link[rel="stylesheet"]')
    .cloneNode(true)

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
