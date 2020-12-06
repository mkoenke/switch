
function getTimer (){
 
    const renderTimerForGame = (gameInfo) => {
        // debugger
        timer.textContent = gameInfo.time
    }

    const startTimer = () => {
        const interval = setInterval(() => {
            let decimal = 4

            timer.textContent = parseFloat(timer.textContent) - 0.1

            if (parseInt(timer.textContent) >= 100) {
                decimal = 4
            } else if (100 > parseInt(timer.textContent) && parseInt(timer.textContent) >= 10) {
                decimal = 3
            } else {
                decimal = 2
            }

            timer.textContent = parseFloat(timer.textContent).toPrecision(decimal)

            if (parseFloat(timer.textContent) === 0 || gameOver) {
                preventClick = true
                clearInterval(interval)
                activeTimer = false
                if (parseFloat(timer.textContent) === 0) {
                    endGame("lose")
                }
            }
        }, 100)
    }
    startButton.addEventListener("click", () => {
        if (!activeTimer) {
            startTimer()
            activeTimer = true
        }
        
        startButton.style.display = "none"

        inGame = true

        if (currentGame.title === "memory") {
            preventClick = false
        } else if (currentGame.title === "sliding") {
            shuffle()
            preventClick = false
        }
    })

    renderTimerForGame(currentGame)
}