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
const prizeDisplay = document.querySelector("#prize-display")
const prizeList = document.querySelector("#prize-list")
const userPrizeList = document.querySelector("#user-prize-list")
const contentDisplay = document.querySelector("#content-display")
const prizeHeader = document.querySelector("#prize-header")
const prizeP = document.querySelector("#prize-p")


//application state

let allUsers
let currentUser = null
let allGames
let currentGame
let currentGameSession

let gameOver = false
let preventClick = true
let correctCombos = 0
let cheat = false
let currentPin
let allPrizes

//aside peekaboo
function elementPeekaboo(element) {
        if (element.style.display === "none") {
        element.style.display = "block";
    } else if (currentUser === null) {
        element.style.display = "none";
    }
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
        // contentDisplay.style.display = "none"
        gameDisplay.innerHTML = ""
        prizeDisplay.innerHTML = ""
        // timer.style.display ="none"
        startButton.style.display = "none"
        aside.style.display = "none"
        document.querySelector(".pin-login__text").value = ""
        currentPin = null
    } else if (event.target.id === "memory" && currentUser) {
        // loadGame("memory")
        currentGame = allGames[0]
        // elementPeekaboo(gameDisplay)
        // elementPeekaboo(timer)
        // elementPeekaboo(startButton)
        gameDisplay.style.display = "block"
        timer.style.display = "block"
        startButton.style.display = "block"
        prizeDisplay.style.display = "none"
        loadAndSetGame()
        console.log(event.target)
    } else if (event.target.id === "memory" && !currentUser){
        alert("Please Log In!")
    } else if (event.target.id === "about"){
        timer.style.display ="none"
        startButton.style.display = "none"
        prizeDisplay.style.display = "none"
        gameDisplay.style.display = "block"
        loadAbout()
        console.log(event.target)
    } else if (event.target.id === "prizes" && currentUser){
        timer.style.display ="none"
        startButton.style.display = "none"
        // gameDisplay.innerHTML = ""
        gameDisplay.style.display = "none"
        // prizeDisplay.innerHTML = ""
        prizeDisplay.style.display = "block"
        prizeHeader.style.display = "block"
        prizeP.style.display = "block"
        prizeList.innerHTML = " "
        prizeList.style.display = "block"
        displayAllPrizes()


    } else if (event.target.id === "prizes" && !currentUser){
        alert("Please Log In!")
    }
}

/// display all prizes
function displayAllPrizes(){
    // debugger


    let array1 = []
    let array2 = []
    
    let leftOverPrizeIds = []
    array1 = allPrizes.map(prize => prize.id)
    array2 = currentUser.prizes.map(prize => prize.id)
    leftOverPrizeIds = array1.filter(prizeId => !array2.includes(prizeId))
    let prizesToBeRendered = []


    for (i=0; i< leftOverPrizeIds.length; i++){
        prizesToBeRendered.push(allPrizes.find(prize => prize.id === leftOverPrizeIds[i]))
        // currentUser.prizes.forEach(userPrize =>{
       
        //     if(allPrizes[i].id !== userPrize.id) {
        //         leftOverPrizes.push(allPrizes[i])
        //         // allPrizes.splice(i, 1)
        //     }
        // })
    }
    
    prizesToBeRendered.forEach(prizeObj => {
        let prizeComponent = new PrizeComponent(prizeObj)
        prizeComponent.render(prizeList)   
    })
 
}


// start game function

function loadAndSetGame(){
    loadGame()
    getTimer()
    memoryJS()
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
        currentUser = returnedUpdatedUser
        renderUserProfile(returnedUpdatedUser)
        console.log(returnedUpdatedUser);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
}


/// load about page

function loadAbout(){
    gameDisplay.innerHTML = `<h1>Welcome to</h1>
    <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimage.remarqueble.com%2Fuspto%2F85324748&f=1&nofb=1" alt="">
    <h2>Play each game as best you can try ti beat the clock! <br>
         The faster you play, the more points you get!</h2>
     `

}

///load memory game

function loadGame(){
   
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
            total_points: 0,
            avatar: event.target.avatar.value
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
                aside.style.display = "block"
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
        fetch(`${URL}/prizes`)
        .then(r => r.json())
        .then(prizeArray => {
            allPrizes = prizeArray
            console.log(prizeArray)
        })
}
initialize()