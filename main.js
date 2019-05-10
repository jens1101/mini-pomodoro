import './lib/countdown-timer/main.js'
import './lib/editable-list/main.js'
import { bootstrap } from './app/main.js'

const countdownElement = document.getElementById('countdown')
const distractionsElement = document.getElementById('distractions')
bootstrap(countdownElement, distractionsElement)
