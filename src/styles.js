import { css } from 'lit-element'

/**
 * A CSS style sheet that contains all the styles.
 * @type {CSSStyleSheet}
 */
const styleSheet = new window.CSSStyleSheet()

/**
 * The lit-element representation of the CSS style sheet. This is so that
 * the styles can easily be used in lit-element components.
 * @type {CSSResult}
 */
const litCss = css``
litCss._styleSheet = styleSheet

const bootstrapUrl = document.querySelector('#bootstrap').href
const fontAwesomeUrl = document.querySelector('#font-awesome').href

/**
 * A promise that resolves into the full style sheet once the import has
 * completed.
 * @type {Promise<CSSStyleSheet>}
 */
const loadingPromise = Promise
  .all([
    window.fetch(bootstrapUrl).then(response => response.text()),
    window.fetch(fontAwesomeUrl).then(response => response.text())
  ])
  .then(([bootstrapCssText, fontAwesomeCssText]) => {
    const cssText = `
      ${bootstrapCssText}

      ${fontAwesomeCssText}

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

    litCss.cssText = cssText

    return styleSheet.replace(cssText)
  })

export { styleSheet, loadingPromise, litCss }
