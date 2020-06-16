import { css } from 'lit-element'

/**
 * @typedef CSSResult
 * @property {string} cssText
 * @property {CSSStyleSheet|null} [_styleSheet]
 * @property {CSSStyleSheet|null} styleSheet
 * @property {Function<string>} toString
 */

/**
 * @typedef StyleSheetResult
 * @property {CSSStyleSheet} styleSheet
 * @property {CSSResult} litCss
 * @property {Promise<CSSStyleSheet>} loadingPromise
 */

/**
 * Constructs a new CSS style sheet and imports the style sheet at the specified
 * URL. The import is asynchronous so a promise is also returned. This also
 * generates a new lit-html CSS object so that the style sheet can easily be
 * used in lit-element components.
 * @param {string} url The URL of the style sheet to import.
 * @returns {StyleSheetResult}
 */
export function getStyleSheetFromUrl (url) {
  /**
   * A CSS style sheet that contains all the styles.
   * @type {CSSStyleSheet}
   */
  const styleSheet = new window.CSSStyleSheet()

  const cssText = `@import url(${url})`

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
