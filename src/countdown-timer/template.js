import { html } from 'lit-html'

/**
 * @typedef {Object} CountdownTimerTemplateOptions
 * @property {string} [startButtonText]
 * @property {EventCallback} [startCountdownCallback]
 * @property {string} [stopButtonText]
 * @property {EventCallback} [stopCountdownCallback]
 */

// TODO: this should simply accept the duration in milliseconds. The conversion
//  to string should happen here.
// TODO: this should also accept the total duration so that we can display a
//  progress bar
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
    <div>${displayDuration}</div>
    <div>
      <button class="btn btn-primary"
              @click="${options.startCountdownCallback}"
              type="button">
        ${startButtonText}
      </button>
      <button class="btn btn-primary"
              @click="${options.stopCountdownCallback}"
              type="button">
        ${stopButtonText}
      </button>
    </div>
  `
}
