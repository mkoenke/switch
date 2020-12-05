
function memoryJS(){
    
    gameTitle.textContent = "Flip!"
    let clickedCard 


    document.addEventListener("keydown", cheatCode)
    function cheatCode(event){
        if(event.key === "y"){
          cheat = true  
        }
    }
        
    ///DOM elements
    const board = document.querySelector(".memory-board")

    /// event listeners

    board.addEventListener("click", handleCardClick)

    ///assign random colors to cards 

    const colors = [
        "red", "orange", "yellow", "green", "blue", "indigo", "purple", "cyan", "lightblue", "orangered", "pink", "salmon", "seagreen", "slategrey", "teal", "blueviolet", "goldenrod", "royalblue"
    ]
    const cards = [...document.querySelectorAll(".card")]
    for (let color of colors){
        const cardAIndex = parseInt(Math.random() * cards.length)
        const cardA = cards[cardAIndex]
        cards.splice(cardAIndex, 1)
        cardA.className += ` ${color}`
        cardA.setAttribute("data-color", color)

        const cardBIndex = parseInt(Math.random() * cards.length)
        const cardB = cards[cardBIndex]
        cards.splice(cardBIndex, 1)
        cardB.className += ` ${color}`
        cardB.setAttribute("data-color", color)
    }

    /// game logic

    function handleCardClick(event){
        if (event.target.className.includes("card")){
        const target = event.target
        if (preventClick || target === clickedCard || target.className.includes("done")){
            return
        }
        target.className = target.className.replace(" color-hidden", "").trim()
        target.className += " done"
        console.log(target.getAttribute("data-color"))
        if (!clickedCard){
        clickedCard = target

        } else if (clickedCard) {
            
            if(clickedCard.getAttribute("data-color") !== target.getAttribute("data-color")){
                preventClick = true
                console.log("cards not equal")
                setTimeout (() => {
                    clickedCard.className = clickedCard.className.replace("done", "").trim() + " color-hidden"
                    target.className = target.className.replace("done", "").trim() + " color-hidden"
                    clickedCard = null
                    preventClick = false
                }, 500)
            
            } else {
                correctCombos++
                console.log("cards ARE equal")
                clickedCard = null
                if (correctCombos === 18 || cheat){
                    alert("You win!")
                    gameOver = true
                    preventClick = true
                    currentGameSession.score = parseInt(timer.textContent)
                    postScore()
                    timer.style.display ="none"
                    loadAbout()
                } 
            }
        }
    }
    }
}