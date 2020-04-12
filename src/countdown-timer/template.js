import { html } from 'lit-html'

/**
 * @callback EventCallback
 * @param {Event} event
 */

/**
 * @typedef {Object} CountdownTimerTemplateOptions
 * @property {string} [startButtonText]
 * @property {EventCallback} [startCountdownCallback]
 * @property {string} [stopButtonText]
 * @property {EventCallback} [stopCountdownCallback]
 */

/**
 *
 * @param {string} displayDuration
 * @param {CountdownTimerTemplateOptions} [options]
 * @return {TemplateResult}
 */
export function template (displayDuration, options = {}) {
  const startButtonText = options.startButtonText || 'Start'
  const stopButtonText = options.stopButtonText || 'Stop'

  return html`
    <div class="countdown-timer--round aspect-ratio aspect-ratio--1to1">
      <div class="countdown-timer__content">
        <div >${displayDuration}</div>
        <div class="flex flex--center">
          <button class="btn btn--primary"
                  @click="${options.startCountdownCallback}"
                  type="button">
            ${startButtonText}
          </button>
          <button class="btn btn--primary"
                  @click="${options.stopCountdownCallback}"
                  type="button">
            ${stopButtonText}
          </button>
        </div>
      </div>
    </div>
  `
}
