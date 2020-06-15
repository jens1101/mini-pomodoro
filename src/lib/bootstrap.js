import { css } from 'lit-element'

// This module is used to get a reference to the bootstrap URL and create a new
// CSS style sheet from it. This exported style sheet can then be used in all
// components without each component needing to have it's own copy.

// Ideally we should import the style sheet, but that requires more effort than
// what it's worth for this setup. This works just fine.
const bootstrapUrl = document.querySelector('#bootstrap').href

/**
 * A CSS style sheet that contains all the Bootstrap styles.
 * @type {CSSStyleSheet}
 */
const bootstrapStyleSheet = new window.CSSStyleSheet()

const cssText = `@import url(${bootstrapUrl})`

/**
 * A promise that resolves into the full bootstrap style sheet once the
 * style sheet import has completed.
 * @type {Promise<CSSStyleSheet>}
 */
const bootstrapLoadingPromise = bootstrapStyleSheet.replace(cssText)

/**
 * The lit-element representation of the CSS style sheet. This is so that
 * bootstrap can easily be used in lit-element components.
 */
const bootstrapCssResult = css``
// noinspection JSConstantReassignment
bootstrapCssResult.cssText = cssText
bootstrapCssResult._styleSheet = bootstrapStyleSheet

export { bootstrapStyleSheet, bootstrapLoadingPromise, bootstrapCssResult }
