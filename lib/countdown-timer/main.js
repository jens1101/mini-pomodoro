/* globals HTMLElement, fetch, DOMParser, CustomEvent */

export class CountdownTimer extends HTMLElement {
  constructor () {
    super()
    this._intervalReference = null

    this._documentPromise = fetch('./lib/countdown-timer/index.html')
      .then(response => response.text())
      .then(html => (new DOMParser()).parseFromString(html, 'text/html'))
  }

  // Specify observed attributes so that `attributeChangedCallback` will work
  static get observedAttributes () { return ['duration', 'start-text', 'stop-text'] }

  async connectedCallback () {
    const templateDocument = await this._documentPromise

    const templateElement = templateDocument.querySelector('template')
    const template = templateElement.content.cloneNode(true)

    this._timeDisplayElement = template.getElementById('time-display')

    const startCountdownButton = template.getElementById('start-countdown')
    startCountdownButton.addEventListener('click', () => this.startCountdown())

    const stopCountdownButton = template.getElementById('stop-countdown')
    stopCountdownButton.addEventListener('click', () => this.stopCountdown())

    const stylesheetLink = templateDocument.querySelector('link[rel="stylesheet"]')

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(stylesheetLink)
    shadowRoot.appendChild(template)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    // TODO: add cases for the start and stop button text
    switch (name) {
      case 'duration':
        // TODO: possibly add support for duration strings via momentjs
        if (isNaN(newValue)) {
          this._duration = 25 * 60 // Default to 25 minutes
        } else {
          this._duration = parseInt(newValue)
        }
    }
  }

  startCountdown () {
    if (this._intervalReference) {
      this.stopCountdown()
    }

    let seconds = this._duration
    this._displayTime(seconds)

    // TODO: This implementation is prone to continuation errors. Rather use a `startTime` timestamp.
    // TODO: Handle duration changes via the attribute
    this._intervalReference = setInterval(() => {
      --seconds
      this._displayTime(seconds)

      if (seconds <= 0) {
        this.stopCountdown()

        // TODO: add timestamp to this event
        const event = new CustomEvent('countdowncomplete')
        this.dispatchEvent(event)
      }
    }, 1000)

    // TODO: add timestamp to this event
    const event = new CustomEvent('countdownstart')
    this.dispatchEvent(event)
  }

  stopCountdown () {
    clearInterval(this._intervalReference)
    this._intervalReference = null
    this._timeDisplayElement.textContent = '00:00'

    // TODO: add timestamp to this event
    const event = new CustomEvent('countdownstop')
    this.dispatchEvent(event)
  }

  _displayTime (duration) {
    // TODO: use moment.js to format this properly

    let minutes = Math.floor(duration / 60)
    let seconds = Math.floor(duration % 60)

    if (minutes < 10) { minutes = `0${minutes}` }
    if (seconds < 10) { seconds = `0${seconds}` }

    this._timeDisplayElement.textContent = `${minutes}:${seconds}`
  }
}
