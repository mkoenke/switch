URL = "http://localhost:3000"
console.log("hello")

fetch(`${URL}/users`)
    .then(r => r.json())
    .then(users => {
        console.log(users)
    })
//-----------------------------------------------------------

//dom elements
const navBar = document.querySelector(".topnav")
const loginDiv = document.querySelector("#login")
// const cancelBtn = modal.querySelector(".cancelBtn")


loginDiv.addEventListener("click", getLoginForm)
//login form 
function getLoginForm(event){
    if (event.target.id === "login"){
        // console.log("I was clicked")
        document.getElementById('modal').style.display='block'
    }
}
const modal = document.getElementById('modal')

// When the user clicks anywhere outside of the modal, close it
document.addEventListener("click", outsideFormClick)

function outsideFormClick(event){
    // console.log(event.target)
    if (event.target == modal) {
        modal.style.display = "none"
      }
}
