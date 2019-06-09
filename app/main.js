import { App } from './app.js'

let app

export function bootstrap (countdownElement, distractionsElement) {
  if (!app) {
    app = new App(countdownElement, distractionsElement)
  }

  return app
}
