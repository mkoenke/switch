// end of game

function endGame(condition) {
    gameOver = true
    preventClick = true
    inGame = false
    if (condition === "win") {
        alert("You win!")
    } else {
        alert("Better luck next time!")
    }
    currentGameSession.score = parseInt(timer.textContent)
    postScore()
    setDisplay([gameTitle, timer, startButton, gameDisplay], "none")
    setDisplay([aboutDisplay], "block")
    // timer.style.display = "none"
    // gameDisplay.style.display = "none"
    // aboutDisplay.style.display = "block"
    loadAbout()
}

// start game function

function loadAndSetGame(gameName) {
    currentGame = allGames.find(game => game.title === gameName)
    setDisplay([gameTitle, timer, startButton, gameDisplay], "block")
    setDisplay([prizeDisplay, aboutDisplay], "none")
    // gameDisplay.style.display = "block"
    // gameTitle.style.display = "block"
    // timer.style.display = "block"
    // startButton.style.display = "block"
    // prizeDisplay.style.display = "none"
    // aboutDisplay.style.display = "none"
    loadGame(gameName)
    if (gameName === "memory") {
        memoryJS()
    } else if (gameName === "sliding") {
        slidingJS()
    }
    getTimer()
    fetchGameSession()
    gameOver = false
    preventClick = true
    correctCombos = 0
    cheat = false
}

// create game session

function fetchGameSession() {
    const newGS = {
        user_id: currentUser.id,
        game_id: currentGame.id
    }
    console.log(newGS)
    fetch(`${URL}/game_sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGS),
    })
        .then(response => response.json())
        .then(returnedGS => {
            console.log('New Game Session:', returnedGS);
            currentGameSession = returnedGS
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

//post score when finished
function postScore() {

    fetch(`${URL}/game_sessions/${currentGameSession.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentGameSession),
    })
        .then(response => response.json())
        .then(updatedGameSession => {
            currentUser.totalPoints = currentUser.totalPoints + updatedGameSession.score

            updateTotalPoints()
            console.log('Updated game session at end of game:', updatedGameSession);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



/// update total points and display on profile

function updateTotalPoints() {
    const updatedTotalPoints = {
        total_points: currentUser.totalPoints
    }
    fetch(`${URL}/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTotalPoints),
    })
        .then(response => response.json())
        .then(returnedUpdatedUser => {
            currentUser = returnedUpdatedUser
            renderUserProfile(returnedUpdatedUser)
            console.log(returnedUpdatedUser);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

///load memory game

function loadGame(gameName) {
    if (gameName === "memory") {
        gameDisplay.innerHTML = `<div class="memory-board"> 
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
    <div class="row">
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
        <div class="card color-hidden" ></div>
    </div>
</div>`
    } else if (gameName === "sliding") {
        gameDisplay.innerHTML = `<div id="table" style="display: inline-block;">
        <div id="row1" style="display: table-row;">
            <div id="cell11" class="tile1" data-row="1" data-col="1"></div>
            <div id="cell12" class="tile2" data-row="1" data-col="2"></div>
            <div id="cell13" class="tile3" data-row="1" data-col="3"></div>
        </div>
        <div id="row2" style="display: table-row;">
            <div id="cell21" class="tile4" data-row="2" data-col="1"></div>
            <div id="cell22" class="tile5" data-row="2" data-col="2"></div>
            <div id="cell23" class="tile6" data-row="2" data-col="3"></div>
        </div>
        <div id="row3" style="display: table-row;">
            <div id="cell31" class="tile7" data-row="3" data-col="1"></div>
            <div id="cell32" class="tile8" data-row="3" data-col="2"></div>
            <div id="cell33" class="tile9" data-row="3" data-col="3"></div>
        </div>
    </div>`
    }
}

/* adding method to array to be able to compare between two arrays */
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (let i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
