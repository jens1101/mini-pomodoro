/* globals HTMLElement */

import { Template } from './template.js'

/**
 * Base class for custom web component creation. It enforces a certain style of
 * creating and using components.
 * @property {Promise} $setupPromise A promise that resolves once the component
 * has finished setting up. This happens after `$initWithUrl` and `$afterInit`
 * have resolved.
 * @property {Template} $template The template class instance that is used by
 * this component. This contains references to all template elements and
 * stylesheets.
 * @property {ShadowRoot} $shadowRoot This component's shadow root. All DOM
 * queries should be done against this.
 * @see Template
 * @extends HTMLElement
 */
export class JtComponent extends HTMLElement {
  /**
   * Creates a new instance of the component.
   * @param {(Url|string)} templateUrl The URL to the HTML file that should be
   * used as the template.
   */
  constructor (templateUrl) {
    super()

    // This promise is used to wait for the setup to finish.
    this.$setupPromise = this.$initWithUrl(templateUrl)
  }

  /**
   * Lifecycle callback function. This gets called after the component has
   * initialised. This is useful for when you need to wait for the template to
   * load before doing setup work. Overwrite this method when you need to make
   * use of it.
   *
   * This function is asynchronous, allowing you to do additional setup work and
   * delaying the `$setupPromise` promise.
   */
  async $afterInit () {
  }

  /**
   * Does the basic component initialisation work. This fetches the template,
   * creates the shadow root, and attaches the first template element and
   * stylesheet to the shadow root.
   * @param {(Url|string)} templateUrl The URL at which the template HTML
   * document is located.
   */
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

    // Call the `$afterInit` callback function after the template has loaded.
    await this.$afterInit()
  }
}
