const profile = document.querySelector("#profile")
const username = profile.querySelector("#username")
const points = profile.querySelector("#points")
const avatar = profile.querySelector("img")

const renderUserProfile = (userObj) => {
    username.textContent = `Username: ${userObj.username}`
    points.textContent = `Points: ${userObj.totalPoints}`
    avatar.src = userObj.avatar
    console.log(userObj)
}


  