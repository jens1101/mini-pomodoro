import { css, LitElement } from 'lit-element'
import { html } from 'lit-html'
import { bootstrapLitCss } from './styles/bootstrap.js'

/**
 * @typedef ToastConfig
 * @property {TOAST_TYPES} type
 * @property {string} headerText
 * @property {string} bodyText
 */

/**
 * @readonly
 * @enum {string}
 */
export const TOAST_TYPES = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info'
}

export class ToastContainerElement extends LitElement {
  constructor () {
    super()

    /**
     * @type {ToastConfig[]}
     * @private
     */
    this.toasts = []
  }

  static get properties () {
    return {
      toasts: { attribute: false }
    }
  }

  static get styles () {
    return [
      bootstrapLitCss,
      css`
      :host {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
      }`
    ]
  }

  /**
   *
   * @param {ToastConfig} toast
   */
  addToast (toast) {
    this.toasts = [...this.toasts, toast]
  }

  removeToast (toast) {
    this.toasts = this.toasts.filter(currentToast => currentToast !== toast)
  }

  render () {
    const toasts = this.toasts.map(toast => this.toastToLitHtml(toast))

    return html`${toasts}`
  }

  /**
   *
   * @param {ToastConfig} toast
   * @returns {TemplateResult}
   */
  toastToLitHtml (toast) {
    let textClass = ''

    switch (toast.type) {
      case TOAST_TYPES.DANGER:
        textClass = 'text-danger'
        break
      case TOAST_TYPES.INFO:
        textClass = 'text-info'
        break
      case TOAST_TYPES.SUCCESS:
        textClass = 'text-success'
        break
      case TOAST_TYPES.WARNING:
        textClass = 'text-warning'
        break
    }

    return html`
      <div class="toast show">
        <div class="toast-header">
          <strong class="mr-auto ${textClass}">${toast.headerText}</strong>
          <button type="button"
                  class="ml-2 mb-1 close"
                  @click="${() => this.removeToast(toast)}">
            <span>&times;</span>
          </button>
        </div>
        <div class="toast-body">
          ${toast.bodyText}
        </div>
      </div>`
  }
}

// Register the custom element.
window.customElements.define('toast-container', ToastContainerElement)
