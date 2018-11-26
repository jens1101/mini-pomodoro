import { App } from './app.js'

let app

export function bootstrap (countdownElement) {
  if (!app) {
    app = new App(countdownElement)
  }

  return app
}
