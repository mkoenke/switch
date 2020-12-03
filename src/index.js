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
let gameOver = false
let currentGameSession
let preventClick = true

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
    // console.log(event.target)
    if (event.target.id === "login" && currentUser === null) {
        document.getElementById('modal').style.display = 'block'
        getPinLogin()
    } else if (event.target.id === "signup" && currentUser === null) {
        console.log(event.target)
        document.getElementById('signupmodal').style.display = 'block'
    } else if (event.target.id === "logout" && currentUser) {
        currentUser = null
        elementPeekaboo(playerProfile)
        elementPeekaboo(gameDisplay)
        elementPeekaboo(timer)
        // elementPeekaboo(startButton)
        console.log(currentUser)
    } else if (event.target.id === "memory" && currentUser) {
        // loadGame("memory")
        currentGame = allGames[0]
        elementPeekaboo(gameDisplay)
        elementPeekaboo(timer)
        elementPeekaboo(startButton)
        loadGame()
        getTimer()
        memoryJS()
        fetchGameSession()
        console.log(event.target)
    } else if (event.target.id === "about"){
        timer.style.display ="none"
        // startButton.style.display = "none"
        loadAbout()
        console.log(event.target)
    }
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

        // TAKE OUT
        currentGameSession.score = 100
        postScore()
        //TAKE OUT
        
        
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
                // alert(error)
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
// const submit = modal.querySelector("#submitbtn")

//submit on login form
// loginForm.addEventListener("submit", handleForm)

// function handleForm(event) {

//     event.preventDefault()


//     const userObj = {
//         username: event.target.username.value,
//         pin: parseInt(event.target.pin.value)
//     }
//     console.log(userObj)
//     let checkedUsers = 0
//     allUsers.forEach(function findCurrentUser(user) {
//         if (user.username === userObj.username && user.pin === userObj.pin) {
//             currentUser = user
//             elementPeekaboo(playerProfile)
//             renderUserProfile(currentUser)
//             modal.style.display = "none"

//         } else {
//             checkedUsers++
//         }
//     })
//     if (checkedUsers === allUsers.length){
//         alert("Wrong Username and/or Pin")
//         event.target.reset()
//     }
//     event.target.reset()


// }
      
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
            const div = document.createElement("div")
            div.textContent = "Please enter your PIN"
            const parent = document.querySelector("#add-message")
            parent.append(div)
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
}
initialize()