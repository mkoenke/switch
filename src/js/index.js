// URL = "http://localhost:3000"
URL = "https://arcane-garden-37304.herokuapp.com"

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
const aboutDisplay = document.querySelector("#about-display")
const gameTitle = document.querySelector("#game-title")
const signupModal = document.getElementById('signupmodal')
const signupForm = signupModal.querySelector("form")
const signupCancelBtn = signupModal.querySelector(".cancelbtn")
const modal = document.getElementById('modal')
const cancelBtn = modal.querySelector(".cancelbtn")
const loginForm = modal.querySelector("form")
const pinLogin = document.querySelector(".pin-login")
const passwordMessageDiv = document.querySelector("#password-message")
const redeemBtn = document.querySelector("#redeem")

//application state
let allUsers
let currentUser = null
let allGames
let currentGame
let currentGameSession
let inGame = false
let activeTimer = false
let gameOver = false
let preventClick = true
let correctCombos = 0
let cheat = false
let currentPin
let allPrizes

// event listeners
navBar.addEventListener("click", handleNavBarClicks)
signupCancelBtn.addEventListener("click", closeSignupForm)
loginForm.addEventListener("submit", handleForm)
cancelBtn.addEventListener("click", closeLoginForm)
document.addEventListener("click", outsideFormClick)
signupForm.addEventListener("submit", handleSignup)

//delegation on nav bar
function setDisplay(args, style) {
    args.forEach((element) => {
        element.style.display = `${style}`
    })
}

function handleNavBarClicks(event) {
    if (inGame) return;
    if (event.target.id === "login" && currentUser === null) {
        document.getElementById('modal').style.display = 'block'
    } else if (event.target.id === "signup" && currentUser === null) {
        document.getElementById('signupmodal').style.display = 'block'
    } else if (event.target.id === "logout" && currentUser) {
        currentUser = null
        gameDisplay.innerHTML = ""
        prizeDisplay.innerHTML = ""
        loginForm.reset()
        setDisplay([aboutDisplay, gameTitle, timer, startButton, playerProfile, pinLogin, passwordMessageDiv], "none")
        document.querySelector(".pin-login__text").value = ""
        currentPin = null
    } else if (event.target.id === "memory" && currentUser || event.target.id === "sliding" && currentUser) {
        loadAndSetGame(event.target.id)
    } else if (event.target.id === "memory" && !currentUser || event.target.id === "sliding" && !currentUser || event.target.id === "prizes" && !currentUser) {
        alert("Please Sign Up or Log In!")
    } else if (event.target.id === "about") {
        setDisplay([gameTitle, timer, startButton, prizeDisplay, gameDisplay], "none")
        setDisplay([aboutDisplay], "block")
        loadAbout()
    } else if (event.target.id === "prizes" && currentUser) {
        setDisplay([gameTitle, timer, startButton, aboutDisplay, gameDisplay], "none")
        prizeList.innerHTML = " "
        setDisplay([prizeHeader, prizeP, prizeList], "block")
        setDisplay([prizeDisplay], "flex")
        displayAllPrizes()
    }
}

/// load about page
function loadAbout() {
    aboutDisplay.innerHTML = `<h1>Welcome to</h1>
    <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimage.remarqueble.com%2Fuspto%2F85324748&f=1&nofb=1" alt="">
    <h2>Play each game as best you can, and try to beat the clock! <br>
    The faster you play, the more points you get!</h2>
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.P-26ZmRveihJNRAoWvnRbAHaE7%26pid%3DApi&f=1" alt=""><br> <h2>Redeem your Points to collect Player's Cards at the Prize Store! </h2>`
}

// sign up form
function closeSignupForm() {
    signupModal.style.display = 'none'
}

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
                setDisplay([aside, playerProfile], "block")
                event.target.reset()
                signupModal.style.display = "none"
                console.log('Success New User:', returnedUserObj);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        alert("Please create a unique username!")
        event.target.reset()
    }
}

//login form
function handleForm(event) {
    event.preventDefault()
    const userObj = {
        username: event.target.username.value
    }
    let checkedUsers = 0
    allUsers.forEach(function findCurrentUser(user) {
        if (user.username === userObj.username) {
            currentUser = user
            passwordMessageDiv.style.display = "block"
            passwordMessageDiv.textContent = "Please enter your PIN"
            pinLogin.style.display = "inline-block"
            getPinLogin()
        } else {
            checkedUsers++
        }
    })
    if (checkedUsers === allUsers.length) {
        alert("Can not find username!")
        event.target.reset()
    }
}

//cancel button on login form
function closeLoginForm() {
    modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
function outsideFormClick(event) {
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
    loadAbout()
}

initialize()