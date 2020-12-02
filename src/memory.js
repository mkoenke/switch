let clickedCard 
let preventClick = false
let correctCombos = 0

const colors = [
    "red", "orange", "yellow", "green", "blue", "indigo", "purple", "cyan", "lightblue", "redorange", "pink", "salmon", "seagreen", "slategrey", "teal", "blueviolet", "goldenrod", "royalblue"
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


function onCardClicked(event){
    const target = event.target
    if (preventClick || target === clickedCard || target.className.includes("done")){
        return
    }
    target.className = target.className.replace("color-hidden", "").trim()
    target.className += " done"
    console.log(target.getAttribute("data-color"))
    if (!clickedCard){
    clickedCard = target

    } else if (clickedCard) {
        
        if(clickedCard.getAttribute("data-color") !== target.getAttribute("data-color")){
            preventClick = true
            console.log("cards not equal")
            setTimeout (() => {
                clickedCard.className = clickedCard.className.replace("done", "").trim() + "color-hidden"
                target.className = target.className.replace("done", "").trim() + "color-hidden"
                clickedCard = null
                preventClick = false
            }, 500)
        
        } else {
            correctCombos++
            console.log("cards ARE equal")
            clickedCard = null
            if (correctCombos === 18){
                alert("You win!")
            }
        }
    }
}