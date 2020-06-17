import { css } from 'lit-element'

/**
 * @typedef StyleSheetResult
 * @property {CSSStyleSheet} styleSheet
 * @property {CSSResult} litCss
 * @property {Promise<CSSStyleSheet>} loadingPromise
 */

const bootstrapUrl = document.querySelector('#bootstrap').href
const fontAwesomeUrl = document.querySelector('#font-awesome').href

const cssText = `
@import url(${bootstrapUrl});
@import url(${fontAwesomeUrl});

.icon-button {
  background-color: transparent;
  padding: 0px;
  border: none;
  float: right;
  text-shadow: rgb(255, 255, 255) 0px 1px 0px;
  opacity: 0.5;
}

.icon-button:not(:disabled):not(.disabled):hover {
  opacity: 0.75;
}
`

export const {
  styleSheet,
  litCss,
  loadingPromise
} = getStyleSheetFromText(cssText)

/**
 * Constructs a new CSS style sheet from the given css text. The construction
 * is asynchronous to allow to style sheet importing, thus a promise is also
 * returned. This also generates a new lit-html CSS object so that the style
 * sheet can easily be used in lit-element components.
 * @param {string} cssText
 * @returns {StyleSheetResult}
 */
function getStyleSheetFromText (cssText) {
  /**
   * A CSS style sheet that contains all the styles.
   * @type {CSSStyleSheet}
   */
  const styleSheet = new window.CSSStyleSheet()

  /**
   * A promise that resolves into the full style sheet once the import has
   * completed.
   * @type {Promise<CSSStyleSheet>}
   */
  const loadingPromise = styleSheet.replace(cssText)

  /**
   * The lit-element representation of the CSS style sheet. This is so that
   * the styles can easily be used in lit-element components.
   * @type {CSSResult}
   */
  const litCss = css``
  litCss.cssText = cssText
  litCss._styleSheet = styleSheet

  return { styleSheet, litCss, loadingPromise }
}
