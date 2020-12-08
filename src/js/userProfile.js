const profile = document.querySelector("#profile")
const username = profile.querySelector("#username")
const points = profile.querySelector("#points")
const avatar = profile.querySelector("img")
const deleteButton = profile.querySelector("#deleteUser")


const renderUserProfile = (userObj) => {
    username.textContent = `Username: ${userObj.username}`
    points.textContent = `Points: ${userObj.totalPoints}`
    avatar.src = userObj.avatar
    editAvatar.addEventListener("click", editAvatarFn)
    redeemBtn.addEventListener("click", function(){
      setDisplay([gameTitle, timer, startButton, aboutDisplay, gameDisplay], "none")
      prizeList.innerHTML = " "
      setDisplay([prizeHeader, prizeP, prizeList], "block")
      setDisplay([prizeDisplay], "flex")
      displayAllPrizes()
    })
    deleteButton.addEventListener("click", deleteUser)
    userPrizeList.innerHTML= ""
    if (currentUser.prizes === undefined || currentUser.prizes.length === 0){
      return
    } else {
      setDisplay([prizeCollection], "block")
      currentUser.prizes.forEach(renderBought)
    }
}

function editAvatarFn(event){
  console.log(event.target)
  const editForm = document.createElement("form")
  editForm.id = "edit-form"
  editForm.style.display = "block"
  editForm.innerHTML = `<input type="text" name="avatar" placeholder="New Image Url" value="" required><br><br>
  <button id="updatebBtn">Update</button>`
  event.target.append(editForm)
  editForm.addEventListener("submit", updateAvatarFetch)
}


function updateAvatarFetch(event){
  event.preventDefault()
  const updatedAvatarObj = {
    avatar: event.target.avatar.value
  }
  console.log(updatedAvatarObj)
  fetch(`${URL}/users/${currentUser.id}`, {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAvatarObj),
  })
  .then(response => response.json())
  .then(returnedUpdatedUser => {
    event.target.remove()
    renderUserProfile(returnedUpdatedUser)
    console.log('Success:', returnedUpdatedUser);
  })
  .catch((error) => {
    console.error('Error:', error);
});

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

const renderBought = (prize) => {
       
  const li = document.createElement("li")
  li.classList.add("prize-card")
  li.innerHTML = `
      <div class="image">
      <img src="${prize.imageUrl}" alt="${prize.name}">
      </div>
      <div class="content">
      <h4>${prize.name}</h4>
      <div class="cost">
          <span class="cost-count">${prize.cost}</span> Points
      </div>
      <p class="description">${prize.description}</p>
      </div>
  `

    userPrizeList.append(li)
  }
  