document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 300);
});

function restructureDOM() {
    const main = document.querySelector('.main');
    const board = document.querySelector('.main__board');
    const section = document.querySelector('.main__card');
    const player1 = document.querySelector('.player--1');
    const player2 = document.querySelector('.player--2');

    if (window.matchMedia("(min-width: 1200px)").matches) {
        if (section) {
            main.insertBefore(player1, board);
            main.insertBefore(player2, board.nextSibling); 
            section.remove(); 
        }
    } else {
        if (!document.querySelector('.main__card')) {
            const newSection = document.createElement('section');
            newSection.classList.add('main__card');
            newSection.appendChild(player1);
            newSection.appendChild(player2);
            main.insertBefore(newSection, board);
        }
    }
}

window.addEventListener('DOMContentLoaded', restructureDOM);
window.addEventListener('resize', restructureDOM);

/*---Create Board---*/
const board = document.getElementById("board");
let gameOver = false;
for (let i = 0; i < 42; i++) {
    let board__space = document.createElement("div");
    board__space.classList.add("board__space");
    board.appendChild(board__space);
}

/*----TURN-FUNCTION-----*/
const timerPlayer = document.getElementById("timerPlayer");
const timerPlayerName = document.getElementById("timerPlayerName");
const timerContainer = document.getElementById("timerContainer");
const root = document.documentElement;

let secondPlayer = false;
let botThinking = false;
let timerID = null;

function turn(botActive) {
    if (gameOver) return;
    secondPlayer = !secondPlayer;
    secondPlayer == true? root.style.setProperty("--playerColor", "rgb(253, 206, 104)") : root.style.setProperty("--playerColor", "rgb(252, 103, 135)");
    timerContainer.style.backgroundColor = secondPlayer == true? "rgb(253, 206, 104)" : "rgb(252, 103, 135)";
    timerContainer.style.color = secondPlayer == true? "black" : "white";

    if (timerID) clearTimeout(timerID);
    function timer(i) {
        if(i < 0) {
            turn(botActive);
            return;
        }
        timerPlayerName.textContent = `PLAYER ${(+ secondPlayer) + 1}'S TURN`
        timerPlayer.textContent = i + "s";
        timerID = setTimeout(() => timer(i - 1), 700);
    }

    if (secondPlayer && botActive) {
        timer(10);
        botThinking = true;
        setTimeout(() => {
            let targetCell = botMovement();  
            let targetColor = targetCell.style.backgroundColor;
            win(targetCell, targetColor);
            checkDraw();
            botThinking = false;
            if (!gameOver) turn(botActive);
        }, 1000);
    } else {
        timer(10);
    };
}

/*----WIN-FUNCTION----*/
let spaces = Array.from(document.querySelectorAll(".board__space"));
const columns = 7;
const rows = 6;
const player1Points = document.getElementById("player1Points");
const player2Points = document.getElementById("player2Points");

function win(cell, color) {
    const index = spaces.indexOf(cell);
    const directions = [
        { step: 1, limit: columns },          
        { step: columns, limit: rows },       
        { step: columns + 1, limit: Math.min(rows, columns) },
        { step: columns - 1, limit: Math.min(rows, columns) },
    ];

    let maxPoint = 0;
    let win = false;
    for (let { step, limit } of directions) {
        let count = 1

        count += countMatches(index, step, limit, color);
        count += countMatches(index, -step, limit, color);
        maxPoint = Math.max(maxPoint, count);
        if (count >= 4) win = true;
    }

    if (secondPlayer == false) player1Points.textContent = parseInt(player1Points.textContent) + maxPoint;
    else player2Points.textContent = parseInt(player2Points.textContent) + maxPoint;

    if (win) {
        gameOver = true;
        setTimeout(() => {
            alert(`Player ${secondPlayer ? "2" : "1"} wins!`);
            location.reload();
        }, 100);
    }

    return win;
}

function countMatches(startIndex, step, limit, color) {
    let count = 0;
    let index = startIndex + step;
    for (let i = 0; i < 3; i++) {
        if (!isValid(index, step, startIndex) || spaces[index]?.style.backgroundColor !== color) {
            break;
        }
        count++;
        index += step;
    }
    return count;
}

function isValid(index, step, startIndex) {
    if (index < 0 || index >= spaces.length) return false;
    
    const startRow = Math.floor(startIndex / columns);
    const startCol = startIndex % columns;
    const indexRow = Math.floor(index / columns);
    const indexCol = index % columns;
    
    if (Math.abs(step) === 1 && startRow !== indexRow) return false;
    
    if (step === columns + 1 || step === -columns - 1 || step === columns - 1 || step === -columns + 1) {
        const rowDiff = Math.abs(indexRow - startRow);
        const colDiff = Math.abs(indexCol - startCol);
        return rowDiff === colDiff;
    }
    
    return true;
}

function fillSpace(target) {
    let colum = (spaces.indexOf(target)) % 7;
    if (spaces[colum].classList.contains("filled")) return null;

    let lastIdx;
    for (let row = 5; row >= 0; row--) {
        lastIdx = (row * columns) + colum;
        if (!spaces[lastIdx].classList.contains("filled")) {
            spaces[lastIdx].style.backgroundColor = secondPlayer ? "rgb(253, 206, 104)" : "rgb(252, 103, 135)";
            spaces[lastIdx].classList.add("filled");
            return spaces[lastIdx];
        }
    }

    return null;
}

/*-----DRAW----*/
function checkDraw() {
    for (let i = 0; i < 7; i++){
        if (!spaces[i].classList.contains("filled")) {
            return;
        }
    }
    gameOver = true;
    setTimeout(() => {
        alert("It's a draw! The board is full with no winner. Try again!");
        location.reload();
    }, 100);
}

/*---Hover---*/
const hoverArrow = Array.from(document.querySelectorAll(".hover__arrow"));
board.addEventListener("mouseover", function(event) {
    let colum = spaces.indexOf(event.target) % 7;
    if (hoverArrow[colum]) hoverArrow[colum].style.visibility = "visible";
});

board.addEventListener("mouseout", function(event) {
    let colum = spaces.indexOf(event.target) % 7;
    if (hoverArrow[colum]) hoverArrow[colum].style.visibility = "hidden";
});

/*---BOT---*/
function possibleMovements(board){
    let movementsList = Array(7).fill(-1);
    for (let idx = 41; idx >= 0; idx--) {
        if (board[idx] == 0 && movementsList[idx % 7] == -1) movementsList[idx % 7] = idx;
    }
    return movementsList;
};

function evaluatePosition(index, color) {
    if (index === -1) return 0;

    const directions = [
        { step: 1, limit: columns },   
        { step: columns, limit: rows }, 
        { step: columns + 1, limit: Math.min(rows, columns) }, 
        { step: columns - 1, limit: Math.min(rows, columns) }, 
    ];

    let maxPoint = 0;
    for (let { step, limit } of directions) {
        let count = 1;
        let forward = countMatches(index, step, limit, color);
        let backward = countMatches(index, -step, limit, color);
        count += forward + backward;
        maxPoint = Math.max(maxPoint, count);
    }

    return maxPoint;
}


function botMovement(){
    spaces = Array.from(document.querySelectorAll(".board__space"));
    let board = [];
    let botColor = "rgb(253, 206, 104)";  
    let playerColor = "rgb(252, 103, 135)"; 
    for (const space of spaces) {
        if (space.style.backgroundColor === botColor) board.push(1);
        else if (space.style.backgroundColor === playerColor) board.push(-1);
        else board.push(0);
    }

    let movements = possibleMovements(board);
    let move;
    let evalMoves = [];
    for (let i = 0; i < movements.length; i++) {
        if (movements[i] === -1) {
            evalMoves.push(0);
            continue;
        }
        evalMoves.push(evaluatePosition(movements[i], botColor));
    }
    
    if (Math.max(...evalMoves) >= 4) {
        move = movements[evalMoves.indexOf(Math.max(...evalMoves))];
    } else {
        let evalEnemyMoves = [];
        for (let i = 0; i < movements.length; i++) {
            if (movements[i] === -1) {
                evalEnemyMoves.push(0);
                continue;
            }
            evalEnemyMoves.push(evaluatePosition(movements[i], playerColor));
        }
        
        move = movements[evalEnemyMoves.indexOf(Math.max(...evalEnemyMoves))];
    }
    fillSpace(spaces[move]);
    return spaces[move];
};

/*----GAME-LOOP----*/
let botActive = new URLSearchParams(window.location.search).get("botActive")
botActive = botActive === "true"

board.addEventListener("click", function(event) {
    if (event.target.classList.contains("board__space") && botThinking == false) {
        let targetCell = fillSpace(event.target);   
        if (targetCell != null) {
            let targetColor = targetCell.style.backgroundColor;
            win(targetCell, targetColor);
            checkDraw();
            turn(botActive);
        }  
    }
})