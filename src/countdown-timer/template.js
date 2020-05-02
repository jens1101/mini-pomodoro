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

/**
 *
 * @param {number} currentDuration The current number of milliseconds that have
 * passed since the timer started
 * @param {number} totalDuration The total number of milliseconds that this
 * timer will run for.
 * @param {CountdownTimerTemplateOptions} [options]
 * @return {TemplateResult}
 */
export function template (currentDuration, totalDuration, options = {}) {
  const startButtonText = options.startButtonText || 'Start'
  const stopButtonText = options.stopButtonText || 'Stop'
  const durationString = durationToDisplayString(currentDuration)

  const progressPercentage =
    '' + Math.min(Math.max(currentDuration / totalDuration * 100, 0), 100)
      .toFixed(2) + '%'

  return html`
    <div class="card text-center">
      <div class="card-body">
        <p class="card-title display-2">${durationString}</p>
        <div class="progress">
          <div class="progress-bar"
               style="width: ${progressPercentage}"></div>
        </div>
      </div>
      <div class="card-footer">
        <button @click="${options.startCountdownCallback}"
                class="btn btn-primary"
                type="button">
          ${startButtonText}
        </button>
        <button @click="${options.stopCountdownCallback}"
                class="btn btn-primary"
                type="button">
          ${stopButtonText}
        </button>
      </div>
    </div>`
}
