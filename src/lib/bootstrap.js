import { css } from 'lit-element'

// Ideally we should import the style sheet, but that requires more effort than
// what it's worth for this setup. This works just fine.
const bootstrapUrl = document.querySelector('#bootstrap').href

const bootstrapStyleSheet = new window.CSSStyleSheet()

const cssText = `@import url(${bootstrapUrl})`
const bootstrapLoadingPromise = bootstrapStyleSheet.replace(cssText)

const bootstrapCssResult = css``
// noinspection JSConstantReassignment
bootstrapCssResult.cssText = cssText
bootstrapCssResult._styleSheet = bootstrapStyleSheet

export { bootstrapStyleSheet, bootstrapLoadingPromise, bootstrapCssResult }
