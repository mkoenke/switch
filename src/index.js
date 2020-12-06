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
const aboutDisplay = document.querySelector("#about-display")
const gameTitle = document.querySelector("#game-title")
const signupModal = document.getElementById('signupmodal')
const signupForm = signupModal.querySelector("form")
const signupCancelBtn = signupModal.querySelector(".cancelbtn")
const modal = document.getElementById('modal')
const cancelBtn = modal.querySelector(".cancelbtn")
const loginForm = modal.querySelector("form")


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
    if (inGame) return;

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
        aboutDisplay.style.display = "none"
        gameTitle.style.display = "none"
        timer.style.display = "none"
        startButton.style.display = "none"
        aside.style.display = "none"
        document.querySelector(".pin-login__text").value = ""
        currentPin = null
    } else if (event.target.id === "memory" || event.target.id === "sliding" && currentUser) {
        loadAndSetGame(event.target.id)
    } else if (event.target.id === "memory" || event.target.id === "sliding" && !currentUser) {
        alert("Please Log In!")
    } else if (event.target.id === "about") {
        timer.style.display = "none"
        startButton.style.display = "none"
        prizeDisplay.style.display = "none"
        gameDisplay.style.display = "none"
        gameTitle.style.display = "none"
        aboutDisplay.style.display = "block"
        loadAbout()
        console.log(event.target)
    } else if (event.target.id === "prizes" && currentUser) {
        timer.style.display = "none"
        startButton.style.display = "none"
        // gameDisplay.innerHTML = ""
        gameDisplay.style.display = "none"
        gameTitle.style.display = "none"
        aboutDisplay.style.display = "none"
        // prizeDisplay.innerHTML = ""
        prizeDisplay.style.display = "block"
        prizeHeader.style.display = "block"
        prizeP.style.display = "block"
        prizeList.innerHTML = " "
        prizeList.style.display = "block"
        displayAllPrizes()


    } else if (event.target.id === "prizes" && !currentUser) {
        alert("Please Log In!")
    }
}

/// load about page

function loadAbout() {
    aboutDisplay.innerHTML = `<h1>Welcome to</h1>
    <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimage.remarqueble.com%2Fuspto%2F85324748&f=1&nofb=1" alt="">
    <h2>Play each game as best you can, and try to beat the clock! <br>
            The faster you play, the more points you get!</h2>
            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.P-26ZmRveihJNRAoWvnRbAHaE7%26pid%3DApi&f=1" alt="">

                `

}


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

            div.textContent = "Please enter your PIN"
        } else {
            checkedUsers++
        }
    })
    if (checkedUsers === allUsers.length) {
        alert("Can not find username!")
        event.target.reset()
    }
    // event.target.reset()


}


//cancel button on login form
cancelBtn.addEventListener("click", closeLoginForm)

function closeLoginForm() {
    modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
document.addEventListener("click", outsideFormClick)

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
}
initialize()