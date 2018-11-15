/* global fetch */

import { ElementMap } from './element-map.js'

/**
 * This class represents a HTML template. It encapsulates an entire HTML
 * document. It also gives convenient access to the template and stylesheet
 * (link) elements contained within the document.
 * @property {Document} document The document object of the entire template
 * page.
 * @property {ElementMap<(string|number), HTMLElement>} elements A hash map
 * that maps all template elements in the document to their index and their ID
 * (if available).
 * @property {(HTMLElement|undefined)} element The first template element in the
 * document. This exists for easy access if you only have one template element
 * in the document.
 * @property {ElementMap<(string|number), HTMLElement>} stylesheets A hash map
 * that maps all stylesheet (`<link>`) elements in the document to their index.
 * @property {(HTMLElement|undefined)} stylesheet The first stylesheet `<link>`
 * element in the document. This exists for ease of access in case you only have
 * one stylesheet in the document.
 */
export class Template {
  /**
   * Create a Template from the given document.
   * @param {Document} document The HTML document from which to initialise the
   * Template instance.
   */
  constructor (document) {
    this.document = document
    this.elements = Template.getTemplateElements(this.document)
    this.element = this.elements.get(0)
    this.stylesheets = Template.getStylesheetElements(this.document)
    this.stylesheet = this.stylesheets.get(0)
  }

  /**
   * Asyncronously creates a new Template object from the given URL.
   * @param {(Url|string)} templateUrl The URL from which to fetch the HTML page
   * which will become the main document of this template.
   * @return {Template}
   */
  static async initWithUrl (templateUrl) {
    return new Template(await Template.getDocumentFromUrl(templateUrl))
  }

  /**
   * For the given URL this function fetches it as text and then parses it into
   * an HTML document object.
   * @param {(Url|string)} url
   * @return {Document}
   */
  static async getDocumentFromUrl (url) {
    const response = await fetch(url)
    const htmlText = await response.text()
    const doc = document.implementation.createHTMLDocument()
    doc.documentElement.innerHTML = htmlText

    return doc
  }

  /**
   * This function gets all the template elements from the given document
   * object.
   * @param {Document} document The document object to search for all template
   * elements.
   * @return {ElementMap<(string|number), HTMLElement>} A map that contains
   * all the templates that were found in the document. It maps the element's
   * position in the selection and it's ID value to the element.
   */
  static getTemplateElements (document) {
    const templateElements = new ElementMap()

    Array.from(document.querySelectorAll('template'))
      .forEach((element, index) => {
        // We loop through each template element in the document, clone it, and
        // add it to templateElements.

        const template = element.content.cloneNode(true)
        templateElements.set(index, template)

        if (element.id) {
          // Also map the ID (if available) to the current element
          templateElements.set(element.id, template)
        }
      })

    return templateElements
  }

  /**
   * This function gets all the stylesheet (`<link>`) elements from the given
   * document object.
   * @param {Document} document The document object to search for all template
   * elements.
   * @return {ElementMap<(string|number), HTMLElement>} A map that contains
   * all the stylesheets that were found in the document. It maps the element's
   * position in the selection and it's ID value to the element.
   */
  static getStylesheetElements (document) {
    const templateStylesheets = new ElementMap()

    Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .forEach((element, index) => {
        // We loop through each link (stylesheet) element in the document, clone
        // it, and add it to templateStylesheets.

        const stylesheet = element.cloneNode(true)
        templateStylesheets.set(index, stylesheet)

        if (element.id) {
          // Also map the ID (if available) to the current element
          templateStylesheets.set(element.id, stylesheet)
        }
      })

    return templateStylesheets
  }
}
