const profile = document.querySelector("#profile")
const username = profile.querySelector("#username")
const points = profile.querySelector("#points")
const avatar = profile.querySelector("img")


const renderUserProfile = (userObj) => {
    username.textContent = `Username: ${userObj.username}`
    points.textContent = `Points: ${userObj.totalPoints}`
    avatar.src = userObj.avatar
    // console.log(userObj)
    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete User Profile"
    profile.append(deleteButton)
    deleteButton.addEventListener("click", deleteUser)

}

function deleteUser(){
  
fetch(`${URL}/users/${currentUser.id}`, {
  method: 'DELETE' 
})
.then(response => response.json())
.then(deletedUser => {
  currentUser = null
  ///GO TO HOME SCREEN
  console.log('Deleted User:', deletedUser)
})
.catch((error) => {
  console.error('Error:', error);
});
}
  