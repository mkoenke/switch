const profile = document.querySelector("#profile")
console.log(profile)
const username = profile.querySelector("#username")
const points = profile.querySelector("#points")

const renderUserProfile = (userObj) => {
    username.textContent = " " + userObj.username
    points.textContent = " " + userObj.totalPoints
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

  renderUserProfile(sampleUser)