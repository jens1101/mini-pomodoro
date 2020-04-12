import { LitElement } from 'lit-element'
import { template } from './template.js'

export class CountdownTimerElement extends LitElement {
  static get properties () {
    return {
      title: { type: String },
      page: { type: String }
    }
  }

  render () {
    return template()
  }
}
