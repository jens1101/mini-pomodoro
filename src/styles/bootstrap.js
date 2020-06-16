import { getStyleSheetFromUrl } from './styleSheet.js'

// This module is used to get a reference to the bootstrap URL and create a new
// CSS style sheet from it. This exported style sheet can then be used in all
// components without each component needing to have it's own copy.

// Ideally we should import the style sheet, but that requires more effort than
// what it's worth for this setup. This works just fine.
const url = document.querySelector('#bootstrap').href

export const {
  styleSheet: bootstrapStyleSheet,
  litCss: bootstrapLitCss,
  loadingPromise: bootstrapLoadingPromise
} = getStyleSheetFromUrl(url)
