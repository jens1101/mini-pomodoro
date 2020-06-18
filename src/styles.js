import fontAwesomeCssText from '@fortawesome/fontawesome-free/css/all.min.css'
import bootstrapCssText from 'bootstrap/dist/css/bootstrap.min.css'
import { css, unsafeCSS } from 'lit-element'

/**
 * The lit-element representation of the CSS style sheet. This is so that
 * the styles can easily be used in lit-element components.
 * @type {CSSResult}
 */
export const litCss = css`
  ${unsafeCSS(bootstrapCssText)}

  ${unsafeCSS(fontAwesomeCssText)}

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
