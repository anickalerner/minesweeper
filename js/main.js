'use strict';
var gMinesweeper = {
    levels: [
        { size: 4, minesNum: 2, label: 'Easy' },
        { size: 8, minesNum: 12, label: 'Medium' },
        { size: 12, minesNum: 30, label: 'Hard' }
    ],
    currLevel: 0,
    board: [],
    mines: [],
    minesToReveal: 0,
    revealedCounter: 0,
    markedMinesCounter: 0,
    isOn: false,
    timer: '000',
    timerInterval: null,
    firstClick: true,
    hintCounter: 3,
    isHintMode: false
};
// cell types
const EMPTY = '⬜';
const MINE = '💣';
const NUMBER = ' ';

const CLOSEDSQUARE = '🟫';
const FLAG = '🚩';

const SMILEY_DEFAULT = '🙂';
const SMILEY_WIN = '😎';
const SMILEY_LOSE = '😩';
const START_TIMER = '000';

const HINT = '💡';

function initGame() {
    setLevelsDisplay(gMinesweeper.levels);
    setGameLevel(0);
}

function setGameLevel(currLevelId) {
    gMinesweeper.currLevel = currLevelId;
    renderActiveLevelButton(currLevelId);
    resetGame();
}

function resetGame() {
    var level = gMinesweeper.levels[gMinesweeper.currLevel];
    gMinesweeper.board = buildBoard(level);
    gMinesweeper.minesToReveal = level.minesNum;
    gMinesweeper.markedMinesCounter = 0;
    gMinesweeper.revealedCounter = 0;
    gMinesweeper.isOn = false;
    gMinesweeper.timer = '000';
    gMinesweeper.firstClick = true;
    gMinesweeper.hintCounter = 3;
    gMinesweeper.isHintMode = false;
    document.querySelector(".message").innerText = '';
    if (gMinesweeper.timerInterval) clearInterval(gMinesweeper.timerInterval);
    setControls(); // in controls.js
    renderBoard(gMinesweeper.board);
    console.clear();
}

function buildBoard(level) {
    var board = [];
    var boardSize = level.size;
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell(i, j);
        }
    }
    return board;
}

function setMines(board, minesNum, notOnPosition) {
    var mines = [];
    while (mines.length < minesNum) {
        var cell = board[getRandomInt(0, board.length)][getRandomInt(0, board.length)];
        if (cell.type === MINE || (cell.i === notOnPosition.i && cell.j === notOnPosition.j)) {
            continue;
        }
        cell.type = MINE;
        cell.isMine = true;
        mines.push(cell);
    }
    for (var i = 0; i < board.length; i++){
        for (var j = 0; j < board[0].length; j++){
            setMinesNegsCount(board, i, j);
        }
    }
    printBoard(gMinesweeper.board);
    return mines;
}

function setMinesNegsCount(board, i, j) {
    if (board[i][j].type === MINE) return;
    var range = getNeighbors(board, i, j);
    for (var x = range.from.i; x <= range.to.i; x++) {
        for (var y = range.from.j; y <= range.to.j; y++) {
            if (x === i && y === j) {
                continue;
            }
            if (board[x][y].type === MINE) {
                board[i][j].minesAround++;
                board[i][j].type = NUMBER;
            }
        }
    }
}

function renderBoard(board) {
    var elTable = document.createElement('table');
    elTable.classList.add(`size-${gMinesweeper.levels[gMinesweeper.currLevel].size}`);
    for (var i = 0; i < board.length; i++) {
        var elTr = document.createElement('tr');
        for (var j = 0; j < board.length; j++) {
            var elTd = document.createElement('td');
            elTd.innerHTML = renderCell(board[i][j]);
            elTd.classList.add('cell', `cell-${i}-${j}`, 'cell-closed');
            elTd.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();
                cellMarked(board, this);
                return false;
            }, false);
            elTd.addEventListener('click', function (ev) {
                cellClicked(board, this, true);
                return false;
            });
            elTr.appendChild(elTd);
        }
        elTable.appendChild(elTr);
    }
    var gameBoard = document.querySelector("#game-board");
    if (gameBoard.querySelector('table')) gameBoard.querySelector('table').remove();
    gameBoard.appendChild(elTable);
}

function startGame() {
    gMinesweeper.firstClick = false;
    gMinesweeper.isOn = true;
    gMinesweeper.timerInterval = setInterval(startGameTimer, 1000);
}

function startGameTimer() {
    gMinesweeper.timer++;
    document.querySelector("#timer").innerText = getPrettyTime(gMinesweeper.timer);
}

function getPrettyTime(time) {
    if (time < 10) return '00' + time;
    if (time < 100) return '0' + time;
    return time;
}

function checkGameOver(cell) {
    // revealed a bomb
    if (cell.type === MINE && cell.revealed) {
        endGame(false);
        return;
    }
    // not all cells are revealed
    if ((gMinesweeper.revealedCounter + gMinesweeper.markedMinesCounter) < getBoardSize(gMinesweeper.board)) {
        return;
    }

    // not all mines are marked
    var mines = gMinesweeper.mines;
    for (var i = 0; i < mines.length; i++) {
        var mine = mines[i];
        if (!mine.isMarked) {
            return;
        }
    }

    // more mines are marked than expected
    if (gMinesweeper.markedMinesCounter !== mines.length) {
        endGame(false);
        return;
    }
    endGame(true);
}

function endGame(isWin) {
    gMinesweeper.isOn = false;
    if (isWin) {
        document.querySelector(".message").innerText = 'Congratulations! You won.';
        updateSmiley(SMILEY_WIN);
    }
    else {
        document.querySelector(".message").innerText = 'Sorry, you lost. Better luck next time.';
        updateSmiley(SMILEY_LOSE);
    }
    clearInterval(gMinesweeper.timerInterval);
    var cells = document.querySelectorAll('.cell');
    cells.forEach(function (cell) {
        cell.classList.add('disabled');
    });

}


