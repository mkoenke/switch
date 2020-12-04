URL = "http://localhost:3000"

//-----------------------------------------------------------

//dom elements
const navBar = document.querySelector(".topnav")
const loginDiv = document.querySelector("#login")
const aside = document.querySelector("aside")
const playerProfile = document.querySelector("#profile");
const gameDisplay = document.querySelector("#game-display")
const timer = document.querySelector("#timer")
const startButton = document.querySelector("#start")


//application state

let allUsers
let currentUser = null
let allGames
let currentGame
let currentGameSession

let activeTimer = false

let gameOver = false
let preventClick = true
let correctCombos = 0
let cheat = false
let currentPin

let checkWinRef

//aside peekaboo
function elementPeekaboo(element) {
        if (element.style.display === "none") {
        element.style.display = "block";
    } else if (currentUser === null) {
        element.style.display = "none";
    }
}

// end game

function endGame(condition) {
    gameOver = true
    preventClick = true
    if (condition === "win"){
        alert("You win!")
    } else {
        alert("Better luck next time!")
    }
    currentGameSession.score = parseInt(timer.textContent)
    postScore()
    timer.style.display = "none"
    loadAbout()
}


//delegation on nav bar

navBar.addEventListener("click", handleNavBarClicks)

function handleNavBarClicks(event) {

    if (event.target.id === "login" && currentUser === null) {
        document.getElementById('modal').style.display = 'block'
        getPinLogin()
    } else if (event.target.id === "signup" && currentUser === null) {
        console.log(event.target)
        document.getElementById('signupmodal').style.display = 'block'
    } else if (event.target.id === "logout" && currentUser) {
        currentUser = null
        elementPeekaboo(playerProfile)
        gameDisplay.innerHTML = ""
        timer.style.display ="none"
        startButton.style.display = "none"
        document.querySelector(".pin-login__text").value = ""
        currentPin = null
    } else if (event.target.id === "memory" || event.target.id === "sliding" && currentUser) {
        loadAndSetGame(event.target.id)
        console.log(event.target)
    } else if (event.target.id === "memory" || event.target.id === "sliding" && !currentUser){
        alert("Please Log In!")
    }else if (event.target.id === "about"){
        timer.style.display ="none"
        startButton.style.display = "none"
        loadAbout()
        console.log(event.target)
    }
}

// start game function

function loadAndSetGame(gameName){
    currentGame = allGames.find(game => game.title === gameName)
    elementPeekaboo(gameDisplay)
    elementPeekaboo(timer)
    elementPeekaboo(startButton)
    loadGame(gameName)
    if (gameName === "memory"){
        memoryJS()
    } else if (gameName === "sliding") {
        checkWinRef = slidingJS()
    }
    getTimer()
    fetchGameSession()
    gameOver = false
    preventClick = true
    correctCombos = 0
    cheat = false
}

// create game session

function fetchGameSession (){
    const newGS = {
        user_id: currentUser.id,
        game_id: currentGame.id
    }
    console.log(newGS)
    fetch(`${URL}/game_sessions`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newGS),
    })
    .then(response => response.json())
    .then(returnedGS => {
        console.log('New Game Session:', returnedGS);
        currentGameSession = returnedGS
    })
    .catch((error) => {
    console.error('Error:', error);
    });
        
}

//post score when finished
function postScore(){

    fetch(`${URL}/game_sessions/${currentGameSession.id}`, {
    method: 'PATCH', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(currentGameSession),
    })
    .then(response => response.json())
    .then(updatedGameSession => {
    currentUser.totalPoints = currentUser.totalPoints + updatedGameSession.score
  
    updateTotalPoints()  
    console.log('Updated game session at end of game:', updatedGameSession);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}



/// update total points and display on profile

function updateTotalPoints(){
    const updatedTotalPoints = {
        total_points: currentUser.totalPoints
    }
    fetch(`${URL}/users/${currentUser.id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTotalPoints),
        })
        .then(response => response.json())
        .then(returnedUpdatedUser => {
        renderUserProfile(returnedUpdatedUser)
        console.log(returnedUpdatedUser);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}


/// load about page

function loadAbout(){
    gameDisplay.innerHTML = `<h1>Welcome to Games Galore!</h1>
    <h2>Play each game as best you can try to beat the clock! <br>
         The faster you play, the more points you get!</h2>
     `

}

///load memory game

function loadGame(gameName){
    if (gameName === "memory"){
        gameDisplay.innerHTML = `<div class="memory-board"> 
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
</div>`
    } else if (gameName === "sliding") {
        gameDisplay.innerHTML = `<div id="table" style="display: inline-block;">
        <div id="row1" style="display: table-row;">
            <div id="cell11" class="tile1" data-row="1" data-col="1"></div>
            <div id="cell12" class="tile2" data-row="1" data-col="2"></div>
            <div id="cell13" class="tile3" data-row="1" data-col="3"></div>
        </div>
        <div id="row2" style="display: table-row;">
            <div id="cell21" class="tile4" data-row="2" data-col="1"></div>
            <div id="cell22" class="tile5" data-row="2" data-col="2"></div>
            <div id="cell23" class="tile6" data-row="2" data-col="3"></div>
        </div>
        <div id="row3" style="display: table-row;">
            <div id="cell31" class="tile7" data-row="3" data-col="1"></div>
            <div id="cell32" class="tile8" data-row="3" data-col="2"></div>
            <div id="cell33" class="tile9" data-row="3" data-col="3"></div>
        </div>
    </div>`
    }
}

const signupModal = document.getElementById('signupmodal')
const signupForm = signupModal.querySelector("form")
const signupCancelBtn = signupModal.querySelector(".cancelbtn")


signupCancelBtn.addEventListener("click", closeSignupForm)

function closeSignupForm() {
    signupModal.style.display = 'none'
}

signupForm.addEventListener("submit", handleSignup)

function handleSignup(event) {
    event.preventDefault()

    const usernames = []
    allUsers.forEach(user => {
        usernames.push(user.username)
    })
    console.log(usernames)
    if (!usernames.includes(event.target.username.value)) {
        const newUserObj = {
            username: event.target.username.value,
            pin: parseInt(event.target.pin.value),
            total_points: 0
        }
        console.log(newUserObj)
        fetch(`${URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserObj),
        })
            .then(response => response.json())
            .then(returnedUserObj => {
                currentUser = returnedUserObj
                renderUserProfile(currentUser)
                elementPeekaboo(playerProfile)
                event.target.reset()
                signupModal.style.display = "none"
                console.log('Success New User:', returnedUserObj);
            })
            .catch((error) => {

                console.error('Error:', error);
            });
        } else {
            alert("you need a uniqe username!")
            event.target.reset()
    }

}

const modal = document.getElementById('modal')
const cancelBtn = modal.querySelector(".cancelbtn")
const loginForm = modal.querySelector("form")

      
loginForm.addEventListener("submit", handleForm)

function handleForm(event) {

    event.preventDefault()
    const userObj = {
        username: event.target.username.value
    }
    let checkedUsers = 0
    allUsers.forEach(function findCurrentUser(user) {
        if (user.username === userObj.username) {
            currentUser = user
            const div = document.querySelector("#error-message")
            // div.innerHTML = ""
            div.textContent = "Please enter your PIN"
        } else {
            checkedUsers++
        }
    })
    if (checkedUsers === allUsers.length){
        alert("Can not find username!")
        event.target.reset()
    }
    event.target.reset()


}
      

//cancel button on login form
cancelBtn.addEventListener("click", closeLoginForm)

function closeLoginForm() {
    modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
document.addEventListener("click", outsideFormClick)

function outsideFormClick(event) {
    // console.log(event.target)
    if (event.target === modal) {
        modal.style.display = "none"
    } else if (event.target === signupModal) {
        signupModal.style.display = "none"
    }
}

/* adding method to array to be able to compare between two arrays */
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


///initialize

function initialize() {
    fetch(`${URL}/users`)
        .then(r => r.json())
        .then(usersArray => {
            allUsers = usersArray
            console.log(usersArray)
        })
    fetch(`${URL}/games`)
        .then(r => r.json())
        .then(gamesArray => {
            allGames = gamesArray
            console.log(gamesArray)
        })
}
initialize()