/* global fetch, DOMParser */

/*
 * This file is a library for component-related stuff.
 */

/**
 * @typedef {Object} Template
 * @property {Document} document The document object of the entire template
 * page.
 * @property {TemplateList<(string|number), HTMLElement>} elements A hash map
 * that maps all template elements in the document to their index and their ID
 * (if available).
 * @property {(HTMLElement|undefined)} element The first template element in the
 * document. This exists for easy access if you only have one template element
 * in the document.
 * @property {(HTMLElement|undefined)} stylesheet The first stylesheet `<link>`
 * element in the document.
 */

/**
 * Gets a template from the specified URL.
 * @param {(URL|string)} templateUrl The URL to the template HTML document.
 * @return {Template}
 */
export async function getTemplate (templateUrl) {
  const response = await fetch(templateUrl)
  const htmlText = await response.text()

  const templateDocument = (new DOMParser())
    .parseFromString(htmlText, 'text/html')

  /**
   * Contains all the templates present in the template document.
   * @type {TemplateList}
   */
  const templateElements = new TemplateList()
  /**
   * Contains the first element in the templateElements map. If no templates
   * were found then this is undefined instead.
   * This is a convenient shortcut when your template document only contains
   * one tempalte.
   * @type {(HTMLElement|undefined)}
   */
  let firstTemplateElement
  Array.from(templateDocument.querySelectorAll('template'))
    .forEach((template, index) => {
      // We loop through all templates in the template document, clone their
      // contents, and assign them to their respecitve variables.

      const element = template.content.cloneNode(true)
      templateElements.set(index, element)
      firstTemplateElement = firstTemplateElement || element

      if (template.id) {
        templateElements.set(template.id, element)
      }
    })

  /**
   * Contains all the stylesheets present in the tempalte document. Each
   * stylesheet is mapped to its index in the DOM.
   * @type {TemplateList}
   */
  const templateStylesheets = new TemplateList()
  /**
   * Contains the first stylesheet in the templateStylesheets map. If no
   * stylesheets were found then this is undefined instead.
   * This is a convenient shortcut when your template document only contains
   * one stylesheet.
   * @type {(HTMLElement|undefined)}
   */
  let firstTemplateStylesheet
  Array.from(templateDocument.querySelectorAll('link[rel="stylesheet"]'))
    .forEach((element, index) => {
      // We loop through all stylesheets in the template document, clone them,
      // and assign them to their respecitve variables.

      const stylesheet = element.cloneNode(true)
      templateStylesheets.set(index, stylesheet)
      firstTemplateStylesheet = firstTemplateStylesheet || stylesheet

      // The DOM Parser doesn't support ID attributes on <link> tags, so we
      // can't support ID mapping for stylesheets.
    })

  return {
    document: templateDocument,
    elements: templateElements,
    element: firstTemplateElement,
    stylesheets: templateStylesheets,
    stylesheet: firstTemplateStylesheet
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
