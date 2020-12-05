function slidingJS() {
    const board = document.querySelector("#table")
    const row1 = board.querySelector("#row1")
    const row2 = board.querySelector("#row2")
    const row3 = board.querySelector("#row3")
    const rows = [row1, row2, row3]
    const winningOrder = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6", "tile7", "tile8", "tile9"]


    board.addEventListener("click", (event) => {
        clickTile(event.target.dataset.row, event.target.dataset.col)
    })
    
    function getTileOrder() {
        let tilesArray = []
        rows.forEach(row => {
            for (let i = 0; i < row.children.length; i++) {
                tilesArray.push(row.children[i].className)
            }
        })
        return tilesArray
    }

    function clickTile(row, column) {
        if (preventClick) return;
        let cell = document.querySelector("#cell" + row + column);
        let tile = cell.className;
        if (tile != "tile9") {
            //Checking if white tile on the right
            if (column < 3) {
                if (document.querySelector("#cell" + row + (parseInt(column) + 1).toString()).className == "tile9") {
                    swapTiles("cell" + row + column, "cell" + row + (parseInt(column) + 1).toString());
                    checkWin()
                    return;
                }
            }
            //Checking if white tile on the left
            if (column > 1) {
                if (document.querySelector("#cell" + row + (parseInt(column) - 1).toString()).className == "tile9") {
                    swapTiles("cell" + row + column, "cell" + row + (parseInt(column) - 1).toString());
                    checkWin()
                    return;
                }
            }
            //Checking if white tile is above
            if (row > 1) {
                if (document.querySelector("#cell" + (parseInt(row) - 1).toString() + column).className == "tile9") {
                    swapTiles("cell" + row + column, "cell" + (parseInt(row) - 1).toString() + column);
                    checkWin()
                    return;
                }
            }
            //Checking if white tile is below
            if (row < 3) {
                if (document.querySelector("#cell" + (parseInt(row) + 1).toString() + column).className == "tile9") {
                    swapTiles("cell" + row + column, "cell" + (parseInt(row) + 1).toString() + column);
                    checkWin()
                    return;
                }
            }
        }
    }

    function checkWin() {
        tileOrder = getTileOrder()
        if (winningOrder.equals(tileOrder)) {
            endGame("win")
        } else if (parseInt(timer.textContent) === 0) {
            endGame("lose")
        }
    }
}

let tileOrder

function swapTiles(cell1, cell2) {
    let temp = document.querySelector(`#${cell1}`).className;
    document.querySelector(`#${cell1}`).className = document.querySelector(`#${cell2}`).className;
    document.querySelector(`#${cell2}`).className = temp;
}

function shuffle() {
    //Use nested loops to access each cell of the 3x3 grid
    for (let row = 1; row <= 3; row++) { //For each row of the 3x3 grid
        for (let column = 1; column <= 3; column++) { //For each column in this row

            let row2 = Math.floor(Math.random() * 3 + 1); //Pick a random row from 1 to 3
            let column2 = Math.floor(Math.random() * 3 + 1); //Pick a random column from 1 to 3

            swapTiles("cell" + row + column, "cell" + row2 + column2); //Swap the look & feel of both cells
        }
    }
}




