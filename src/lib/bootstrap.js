import { css } from 'lit-element'

const bootstrapUrl = document.querySelector('#bootstrap').href

const bootstrapStyleSheet = new window.CSSStyleSheet()

const cssText = `@import url(${bootstrapUrl})`
const bootstrapLoadingPromise = bootstrapStyleSheet.replace(cssText)

const bootstrapCssResult = css``
// noinspection JSConstantReassignment
bootstrapCssResult.cssText = cssText
bootstrapCssResult._styleSheet = bootstrapStyleSheet

export { bootstrapStyleSheet, bootstrapLoadingPromise, bootstrapCssResult }
