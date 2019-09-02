import { Template } from './template.js'

export class ComponentHelper {
  /**
   * Initialises the given component with a template. This fetches the template
   * from the given URL, attaches a shadow root to the component, and attaches
   * the first template element and stylesheet to the shadow root.
   * @param {HTMLElement} component The custom component to initialise.
   * @param {(URL|string)} templateUrl The URL at which the template HTML
   * document is located.
   * @return {Promise<Template>} A promise that resolves into the template
   * object that was created.
   */
  static async initWithUrl (component, templateUrl) {
    // initialise the template using the given URL
    const template = await Template.initWithUrl(templateUrl)

    // Create the component's shadow root and attach the first element and
    // stylesheet to it (if they exist). This is done out of convention.
    component.attachShadow({ mode: 'open' })
    if (template.element) {
      component.shadowRoot.appendChild(template.element)
    }
    for (const stylesheet of template.stylesheets.values()) {
      component.shadowRoot.appendChild(stylesheet)
    }

    // Return the template object in case the user wants to use it further.
    return template
  }
}
