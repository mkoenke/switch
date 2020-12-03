// function prizeDisplayJS(){
    class PrizeComponent {
        constructor(prizeObj) {
          this.prize = prizeObj
        }
      
        handleBuy = () => {
        //   this.prize.donations += 10
        //   const span = this.findChildElement(".donation-count")
        //   span.textContent = this.animal.donations
      
        //   client.patch(`/animals/${this.animal.id}`, {
        //     donations: this.animal.donations
        //   })
        }
      
        // handleDelete = () => {
        //   this.element.remove()
        //   client.delete(`/animals/${this.animal.id}`)
        // }
      
        findChildElement(selector) {
          return this.element.querySelector(selector)
        }
      
        render(parentElement) {
          this.element = document.createElement("li")
          this.element.classList.add("card")
          this.element.innerHTML = `
            <div class="image">
              <img src="${this.prize.imageUrl}" alt="${this.prize.name}">
            </div>
            <div class="content">
              <h4>${this.prize.name}</h4>
              <div class="cost">
                $<span class="cost-count">${this.prize.cost}</span> Points
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