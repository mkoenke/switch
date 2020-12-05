function getPinLogin(){
    class PinLogin {
        constructor ({el, maxNumbers}) {
            this.el = {
                main: el,
                numPad: el.querySelector(".pin-login__numpad"),
                textDisplay: el.querySelector(".pin-login__text")
            };

            this.maxNumbers = 4
            this.value = ""
            this._generatePad()
        }

        _generatePad() {

            document.querySelector(".pin-login__numpad").innerHTML = ""

            const padLayout = [
                "1", "2", "3",
                "4", "5", "6",
                "7", "8", "9",
                "backspace", "0", "done"
            ];

            padLayout.forEach(key => {
                const insertBreak = key.search(/[369]/) !== -1
                const keyEl = document.createElement("div")

                keyEl.classList.add("pin-login__key");
                keyEl.classList.toggle("material-icons", isNaN(key))
                keyEl.textContent = key
                keyEl.addEventListener("click", () => { this._handleKeyPress(key) })
                this.el.numPad.appendChild(keyEl)

                if (insertBreak) {
                    this.el.numPad.appendChild(document.createElement("br"))
                }
            })
        }

        _handleKeyPress(key) {
            switch (key) {
                case "backspace":
                    this.value = this.value.substring(0, this.value.length - 1)
              
                    break 
                case "done":
                    this._attemptLogin()
                    break
                default:
                    if (this.value.length < this.maxNumbers && !isNaN(key)) {
                        this.value += key
                    }
                    break
            }

            this._updateValueText()
        }

        _updateValueText() {
            this.el.textDisplay.value = "*".repeat(this.value.length)
            this.el.textDisplay.classList.remove("pin-login__text--error")
        }

        _attemptLogin() {
            
            if (this.value.length > 0){
                const correctPin = currentUser.pin
                console.log(correctPin)
                
                if (parseInt(this.value) === correctPin){
                    console.log(this)
                    elementPeekaboo(playerProfile)
                    aside.style.display = "block"
                    renderUserProfile(currentUser)
                    modal.style.display = "none"
                } else {
                    alert("Wrong PIN, please try again!")
                    this.value = ""
                    console.log(this)
                    
                }
            }
     
        
        }
    }

    currentPin = new PinLogin({
        el: document.getElementById("mainPinLogin")
        
    })
    
}