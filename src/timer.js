// const timer = document.querySelector("#timer")
function getTimer (){
 
    const renderTimerForGame = (gameInfo) => {
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
            
            if (parseFloat(timer.textContent) === 0){
                clearInterval(interval)
            }
        }, 100)
    }

   const button = document.createElement("button")
    button.textContent = "START!"
    button.addEventListener("click", startTimer)
    timer.append(button)

    renderTimerForGame(currentGame)
}