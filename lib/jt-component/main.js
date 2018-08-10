/* global fetch, DOMParser */

export async function getTemplate (templateUrl) {
  // TODO: maybe cache or memorise this.
  const response = await fetch(templateUrl)
  const htmlText = await response.text()

  const templateDocument = (new DOMParser())
    .parseFromString(htmlText, 'text/html')

  // TODO: put the below items in a Map
  // How it works:
  // - Add index->element to Map
  // - If the item has an ID then add id->element to Map
  // In this way people can access the element by ID or index
  // This may be bad for iteration, but we can cross that bridge when we get
  // there.
  const templateElements = new Map()
  for (const element of templateDocument.querySelectorAll('template')) {
    

    if (element) {

    }
  }

  const templateElement = templateDocument.querySelectorAll('template')
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
