/* global fetch, DOMParser */

export async function getTemplate (templateUrl) {
  // TODO: maybe cache or memorise this.
  const response = await fetch(templateUrl)
  const htmlText = await response.text()

  const templateDocument = (new DOMParser())
    .parseFromString(htmlText, 'text/html')
  const templateElement = templateDocument.querySelector('template')
    .content
    .cloneNode(true)
  const templateStylesheet = templateDocument
    .querySelector('link[rel="stylesheet"]')
    .cloneNode(true)

  return {
    document: templateDocument,
    element: templateElement,
    stylesheet: templateStylesheet
  }
}
