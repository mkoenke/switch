const profile = document.querySelector("#profile")
console.log(profile)
const username = profile.querySelector("#username")
const points = profile.querySelector("#points")
const avatar = profile.querySelector("img")

const renderUserProfile = (userObj) => {
    username.textContent = `Username: ${userObj.username}`
    points.textContent = `Points: ${userObj.totalPoints}`
    avatar.src = userObj.avatar
    console.log(userObj)
}

const sampleUser = {
    "id": 1,
    "username": "bob",
    "pin": 1234,
    "totalPoints": 0,
    "gameSessions": [
      {
        "id": 1,
        "userId": 1,
        "gameId": 1,
        "score": 60
      },
      {
        "id": 4,
        "userId": 1,
        "gameId": 1,
        "score": 27
      }
    ]
  }

  