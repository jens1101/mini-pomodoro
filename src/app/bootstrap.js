import { css } from '../../web_modules/lit-element.js'

// TODO: this might not work once the project is built. I should maybe consider
//  using a CDN until CSS modules are a thing
const bootstrapUrl = new URL(
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css')

const bootstrapStyleSheet = new window.CSSStyleSheet()

const cssText = `@import url(${bootstrapUrl.href})`
const bootstrapLoadingPromise = bootstrapStyleSheet.replace(cssText)

const bootstrapCssResult = css``
// noinspection JSConstantReassignment
bootstrapCssResult.cssText = cssText
bootstrapCssResult._styleSheet = bootstrapStyleSheet

export { bootstrapStyleSheet, bootstrapLoadingPromise, bootstrapCssResult }
