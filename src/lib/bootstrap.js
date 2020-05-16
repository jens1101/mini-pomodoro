import { css } from '../../web_modules/lit-element.js'

const bootstrapUrl = new URL(
  'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/darkly/bootstrap.min.css')

const bootstrapStyleSheet = new window.CSSStyleSheet()

const cssText = `@import url(${bootstrapUrl.href})`
const bootstrapLoadingPromise = bootstrapStyleSheet.replace(cssText)

const bootstrapCssResult = css``
// noinspection JSConstantReassignment
bootstrapCssResult.cssText = cssText
bootstrapCssResult._styleSheet = bootstrapStyleSheet

export { bootstrapStyleSheet, bootstrapLoadingPromise, bootstrapCssResult }
