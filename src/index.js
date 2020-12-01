URL = "http://localhost:3000"

//-----------------------------------------------------------

//dom elements
const navBar = document.querySelector(".topnav")
const loginDiv = document.querySelector("#login")

//application state

let allUsers
let currentUser
 

//delegation on nav bar

navBar.addEventListener("click", handleNavBarClicks)

function handleNavBarClicks(event){
    // console.log(event.target)
    if (event.target.id === "login"){
        document.getElementById('modal').style.display='block'
    } else if (event.target.id === "signup"){
        console.log(event.target)
        document.getElementById('signupmodal').style.display='block'
    } else if (event.target.id === "logout"){
        currentUser = null
        console.log(currentUser)
    }
}

const signupModal = document.getElementById('signupmodal')
const signupForm = signupModal.querySelector("form")

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
    console.log('Success New User:', returnedUserObj);
    })
    .catch((error) => {
    console.error('Error:', error);
    });

    event.target.reset()
}

const modal = document.getElementById('modal')
const cancelBtn = modal.querySelector(".cancelbtn")
const loginForm = modal.querySelector("form")
const submit = modal.querySelector("#submitbtn")

//submit on login form
loginForm.addEventListener("submit", handleForm)

function handleForm(event){

    event.preventDefault()
    // console.log(event.target)
    
        const userObj = {
            username: event.target.username.value,
            pin: parseInt(event.target.pin.value)
        }
        console.log(userObj)
        allUsers.forEach(function findCurrentUser(user){
            if (user.username === userObj.username && user.pin === userObj.pin){
                // console.log(user)
                // console.log(userObj)
                currentUser = user
                renderUserProfile(currentUser)
            }
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
    if (event.target == modal) {
        modal.style.display = "none"
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
}
initialize()