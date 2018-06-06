// TODO: Maybe use local storage so that the pomodoro doesn't get lost when closing the tab.
// TODO: Add the ability to add distractions

let interval = null
const COUNTDOWN_SECONDS = 25 * 60 // 25 minutes
// const COUNTDOWN_SECONDS = 3
const notificationSound = new Audio();
notificationSound.src = 'https://www.myinstants.com/media/sounds/its-time-to-stop-button.mp3'

function startPomodoro() {
    if (interval) {
        stopPomodoro()
    }
    
    let seconds = COUNTDOWN_SECONDS
    displayTime(seconds)

    interval = setInterval(() => {
        --seconds
        displayTime(seconds)
        
        if(seconds <= 0) {
            stopPomodoro()
            showNotification()
        }
    }, 1000);
}

function stopPomodoro() {
    clearInterval(interval)
    interval = null
    document.getElementById("countdown").innerHTML = ''
}

function displayTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let _seconds = Math.floor(seconds % 60);
    
    if (minutes < 10) { minutes = `0${minutes}` }
    if (_seconds < 10) { _seconds = `0${_seconds}` }
    
    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML = `${minutes}:${_seconds}`
}

function showNotification() {
    if (Notification.permission === "granted") {
        var notification = new Notification("Time is up!");
        notificationSound.play()
    }
}
