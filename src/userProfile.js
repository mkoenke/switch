const profile = document.querySelector("#profile")
const username = profile.querySelector("#username")
const points = profile.querySelector("#points")
const avatar = profile.querySelector("img")

const renderUserProfile = (userObj) => {
    username.textContent = `Username: ${userObj.username}`
    points.textContent = `Points: ${userObj.totalPoints}`
    avatar.src = userObj.avatar
<<<<<<< HEAD
=======
    console.log(userObj)
>>>>>>> 845c71cab72ebd2741771267762136d9aaf5a6d2
}


  