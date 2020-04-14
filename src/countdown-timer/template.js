import { html } from '../../web_modules/lit-html.js'

/**
 * @typedef {Object} CountdownTimerTemplateOptions
 * @property {string} [startButtonText]
 * @property {EventCallback} [startCountdownCallback]
 * @property {string} [stopButtonText]
 * @property {EventCallback} [stopCountdownCallback]
 */

/**
 * @nosideeffects
 * @param {number} durationMs
 * @return {string}
 */
function durationToDisplayString (durationMs) {
  const durationSeconds = durationMs / 1000
  const seconds = `${Math.floor(durationSeconds % 60)}`.padStart(2, '0')

  const durationMinutes = durationSeconds / 60
  const minutes = `${Math.floor(durationMinutes % 60)}`.padStart(2, '0')

  const hours = `${Math.floor(minutes / 60)}`.padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

// TODO: this should also accept the total duration so that we can display a
//  progress bar
/**
 *
 * @param {number} currentDuration
 * @param {CountdownTimerTemplateOptions} [options]
 * @return {TemplateResult}
 */
export function template (currentDuration, options = {}) {
  const startButtonText = options.startButtonText || 'Start'
  const stopButtonText = options.stopButtonText || 'Stop'
  const durationString = durationToDisplayString(currentDuration)

  return html`
    <div>${durationString}</div>
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
