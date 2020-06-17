import { css, LitElement } from 'lit-element'
import { html } from 'lit-html'
import { litCss } from './styles.js'

/**
 * All the configuration necessary for a toast.
 * @typedef ToastConfig
 * @property {TOAST_TYPES} type
 * @property {string|TemplateResult} headerText
 * @property {string|TemplateResult} bodyText
 */

/**
 * All the available toast types. Each type will add a different styling to the
 * toast.
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

/**
 * A container for toasts. By default it will position itself absolutely in the
 * top right hand corner. Toasts are displayed top down in the order of
 * insertion.
 *
 * Typically only one of these is used per app, but it is possible to have
 * multiple instances running at the same time. They do not interfere with
 * each other.
 */
export class ToastContainerElement extends LitElement {
  constructor () {
    super()

    /**
     * All toasts currently inside this container.
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
      litCss,
      css`
        :host {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          z-index: 100;
        }
      `
    ]
  }

  /**
   * Add the specified toast to the container.
   * @param {ToastConfig} toast
   */
  addToast (toast) {
    this.toasts = [...this.toasts, toast]
  }

  /**
   * Remove the specified toast from the container.
   * @param {ToastConfig} toast
   */
  removeToast (toast) {
    this.toasts = this.toasts.filter(currentToast => currentToast !== toast)
  }

  render () {
    const toasts = this.toasts.map(toast => this.toastToLitHtml(toast))

    return html`${toasts}`
  }

  /**
   * Converts the specified toast config to HTML.
   * @param {ToastConfig} toast
   * @returns {TemplateResult}
   */
  toastToLitHtml (toast) {
    let textClass = ''
    let iconClass = 'fas fa-circle'

    switch (toast.type) {
      case TOAST_TYPES.DANGER:
        textClass = 'text-danger'
        iconClass = 'fas fa-times-circle'
        break
      case TOAST_TYPES.INFO:
        textClass = 'text-info'
        iconClass = 'fas fa-info-circle'
        break
      case TOAST_TYPES.SUCCESS:
        textClass = 'text-success'
        iconClass = 'fas fa-check-circle'
        break
      case TOAST_TYPES.WARNING:
        textClass = 'text-warning'
        iconClass = 'fas fa-exclamation-circle'
        break
    }

    return html`
      <div class="toast show">
        <div class="toast-header">
          <span class="mr-1 ${textClass} ${iconClass}"></span>
          <strong class="mr-auto ${textClass}">${toast.headerText}</strong>

          <button type="button"
                  class="ml-3 icon-button"
                  @click="${() => this.removeToast(toast)}">
            <span class="fas fa-times"></span>
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
