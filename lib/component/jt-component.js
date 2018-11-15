/* globals HTMLElement */

import { Template } from '../component/main.js'

export class JtComponent extends HTMLElement {
  constructor (templateUrl) {
    super()

    // This promise is used to wait for the setup to finish.
    this.$setupPromise = this.$initWithUrl(templateUrl)
  }

  async $initWithUrl (templateUrl) {
    this.$template = await Template.initWithUrl(templateUrl)

    // Create the shadow root and attach the first element and stylesheet to it
    // (if they exist). This is done out of convention.
    this.$shadowRoot = this.attachShadow({ mode: 'open' })
    if (this.$template.element) {
      this.$shadowRoot.appendChild(this.$template.element)
    }
    if (this.$template.stylesheet) {
      this.$shadowRoot.appendChild(this.$template.stylesheet)
    }
  }
}
