let clickedCard 

function onCardClicked(event){
    const target = event.target
    console.log("clicked", event.target)
    target.className = target.className.replace("color-hidden", "").trim()
    if (!clickedCard){
    clickedCard = target
    } else if (clickedCard) {

    }
}