const timer = document.querySelector("#timer")

const renderTimerForGame = (gameInfo) => {
    timer.textContent = gameInfo.time
}

const startTimer = () => {
    const interval = setInterval(() => {
        timer.textContent = parseInt(timer.textContent) - 1
        if (parseInt(timer.textContent) === 0){
            clearInterval(interval)
        }
    }, 1000)
}


const sampleGameInfo = {
    "id": 1,
    "title": "memory",
    "time": 20
}

renderTimerForGame(sampleGameInfo)
// startTimer()