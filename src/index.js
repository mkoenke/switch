URL = "http://localhost:3000"

//-----------------------------------------------------------

//dom elements
const navBar = document.querySelector(".topnav")
const loginDiv = document.querySelector("#login")
const aside = document.querySelector("aside")

//application state

let allUsers
let currentUser = null
let allGames
let currentGame

//aside peekaboo
function asidePeekaboo() {
    const aside = document.querySelector("#profile");
    if (aside.style.display === "none") {
      aside.style.display = "block";
    } else if (currentUser === null) {
      aside.style.display = "none";
    }
  }
 

//delegation on nav bar

navBar.addEventListener("click", handleNavBarClicks)

function handleNavBarClicks(event){
    // console.log(event.target)
    if (event.target.id === "login" && currentUser === null){
        document.getElementById('modal').style.display='block'
    } else if (event.target.id === "signup" && currentUser === null){
        console.log(event.target)
        document.getElementById('signupmodal').style.display='block'
    } else if (event.target.id === "logout" && currentUser){
        currentUser = null
        asidePeekaboo()
        console.log(currentUser)
    } else if (event.target.id === "memory" && currentUser){
        // loadGame("memory")
        console.log(event.target)
    }
}

const signupModal = document.getElementById('signupmodal')
const signupForm = signupModal.querySelector("form")
const signupCancelBtn = signupModal.querySelector(".cancelbtn")


signupCancelBtn.addEventListener("click", closeSignupForm)

function closeSignupForm(){
    signupModal.style.display='none'
}

signupForm.addEventListener("submit", handleSignup)

function handleSignup(event){
    event.preventDefault()
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
        asidePeekaboo()
        event.target.reset()
        signupModal.style.display = "none"
        console.log('Success New User:', returnedUserObj);
    })
    .catch((error) => {
        // alert(error)
    console.error('Error:', error);
    });

    
}

const modal = document.getElementById('modal')
const cancelBtn = modal.querySelector(".cancelbtn")
const loginForm = modal.querySelector("form")
// const submit = modal.querySelector("#submitbtn")

//submit on login form
loginForm.addEventListener("submit", handleForm)

function handleForm(event){

    event.preventDefault()
        const userObj = {
            username: event.target.username.value,
            pin: parseInt(event.target.pin.value)
        }
        console.log(userObj)
        allUsers.forEach(function findCurrentUser(user){
            if (user.username === userObj.username && user.pin === userObj.pin){
                currentUser = user
                asidePeekaboo()
                renderUserProfile(currentUser)
                 modal.style.display = "none"
    
            } //else {
            //     alert("Please try again!")
            //     modal.style.display = "none"
            // }
        })
       event.target.reset() 
      
}

//cancel button on login form
cancelBtn.addEventListener("click", closeLoginForm)

function closeLoginForm(){
    modal.style.display='none'
}

// When the user clicks anywhere outside of the modal, close it
document.addEventListener("click", outsideFormClick)

function outsideFormClick(event){
    // console.log(event.target)
    if (event.target === modal) {
        modal.style.display = "none"
    } else if (event.target === signupModal){
        signupModal.style.display = "none"
    }
}


///initialize

function initialize(){
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