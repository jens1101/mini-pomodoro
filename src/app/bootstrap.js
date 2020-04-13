import { css } from 'lit-element'

// TODO: this might not work once the project is built.
const bootstrapUrl = new URL(
  '../../node_modules/bootstrap/dist/css/bootstrap.css',
  import.meta.url)

const bootstrapStyleSheet = new window.CSSStyleSheet()

const cssText = `@import url(${bootstrapUrl.href})`
const bootstrapLoadingPromise = bootstrapStyleSheet.replace(cssText)

const bootstrapCssResult = css``
// noinspection JSConstantReassignment
bootstrapCssResult.cssText = cssText
bootstrapCssResult._styleSheet = bootstrapStyleSheet

export { bootstrapStyleSheet, bootstrapLoadingPromise, bootstrapCssResult }
