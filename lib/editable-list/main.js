const distractionForm = document.querySelector('.add-distraction')
const distractionsList = document.querySelector('.distractions')

distractionForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const inputElement = distractionForm.querySelector('input')
  addDistraction(inputElement.value)

  distractionForm.reset()
  inputElement.focus()
})

function addDistraction (distraction) {
  // TODO: add an auto-complete feature based on what you previously typed in here.
  const liElement = distractionsList
    .querySelector('.distraction-template')
    .content
    .firstElementChild
    .cloneNode(true)

  liElement.querySelector('span').appendChild(document.createTextNode(distraction))
  liElement.querySelector('button').addEventListener('click', () => liElement.remove())

  distractionsList.appendChild(liElement)
}

//---

/* globals HTMLElement */

import {getTemplate} from '../jt-component/main.js'

export class EditableList extends HTMLElement {
  async connectedCallback () {
    const template = await getTemplate('./lib/countdown-timer/index.html')

    this._timeDisplayElement = template.element.getElementById('time-display')

    const startCountdownButton = template.element.getElementById('start-countdown')
    startCountdownButton.addEventListener('click', () => this.startCountdown())

    const stopCountdownButton = template.element.getElementById('stop-countdown')
    stopCountdownButton.addEventListener('click', () => this.stopCountdown())

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.element)
    shadowRoot.appendChild(template.stylesheet)
  }
}
