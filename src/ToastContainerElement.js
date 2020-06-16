import { css, LitElement } from 'lit-element'
import { html } from 'lit-html'

export class ToastContainerElement extends LitElement {
  static get styles () {
    return css`
      #toast-container {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
      }`
  }

  render () {
    return html`
      <aside id="toast-container">
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="mr-auto">
              Notification
            </strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
              <span class="gg-close"></span>
            </button>
          </div>
          <div class="toast-body">
            See? Just like this.
          </div>
        </div>

        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="mr-auto">
              Notification
            </strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
              <span class="gg-close"></span>
            </button>
          </div>
          <div class="toast-body">
            Heads up, toasts will stack automatically
            Heads up, toasts will stack automatically
            Heads up, toasts will stack automatically
            Heads up, toasts will stack automatically
            Heads up, toasts will stack automatically
          </div>
        </div>
      </aside>`
  }
}
