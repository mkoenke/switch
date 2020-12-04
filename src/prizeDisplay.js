// function prizeDisplayJS(){
class PrizeComponent {
    constructor(prizeObj) {
        this.prize = prizeObj
    }

    handleBuy = () => {

        // debugger


        let userPrizeObj = {
            user_id: currentUser.id,
            prize_id: this.prize.id
        }
        currentUser.totalPoints = currentUser.totalPoints - this.prize.cost

        fetch(`${URL}/user_prizes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPrizeObj),
        })
            .then(response => response.json())
            .then(updatedUser => {
                this.element.remove()
                // this.element.renderBought(userPrizeList) 
                // debugger
                currentUser = updatedUser
                // console.log(updatedUser)
                
                renderUserProfile(updatedUser)

                console.log('Success updated user:', updatedUser);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // updateTotalPoints()

        

        //remove card from prize display
        // create user prize 
        // render card on collected card list
    }


    findChildElement(selector) {
        return this.element.querySelector(selector)
    }

    // renderBought(parentElement){

    // this.element = document.createElement("li")
    // this.element.classList.add("card")
    // this.element.innerHTML = `
    //     <div class="image">
    //     <img src="${this.prize.imageUrl}" alt="${this.prize.name}">
    //     </div>
    //     <div class="content">
    //     <h4>${this.prize.name}</h4>
    //     <div class="cost">
    //         $<span class="cost-count">${this.prize.cost}</span> Points
    //     </div>
    //     <p class="description">${this.prize.description}</p>
    //     </div>
    // `

    //   parentElement.append(this.element)
    // }

    render(parentElement) {
        this.element = document.createElement("li")
        this.element.classList.add("prize-card")
        this.element.innerHTML = `
            <div class="image">
              <img src="${this.prize.imageUrl}" alt="${this.prize.name}">
            </div>
            <div class="content">
              <h4>${this.prize.name}</h4>
              <div class="cost">
                <span class="cost-count">${this.prize.cost}</span> Points
              </div>
              <p class="description">${this.prize.description}</p>
            </div>
            <button class="button buy-button" data-action="buy">
              Buy for 100 Points!
            </button>
          `

        const buyButton = this.findChildElement(".buy-button")
        buyButton.addEventListener("click", this.handleBuy)


        parentElement.append(this.element)
    }
}
// }