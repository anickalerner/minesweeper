'use strict';
var gMinesweeper = {
    levels: [{ size: 4, minesNum: 2 }, { size: 8, minesNum: 12 }, { size: 12, minesNum: 30 }],
    level: {},
    board: [],
    mines: [],
    revealedCount: 0,
    isOn: false,
    timer: 0,
    timerInterval: null
};
const EMPTY = '⬜';
const MINE = '💣';
const NUMBER = ' ';
const CLOSEDSQUARE = '🟫';
const FLAG = '🚩';
const SMILEY_DEFAULT = '🙂';
const SMILEY_WIN = '😎';
const SMILEY_LOSE = '😩';

function initGame() {
    gMinesweeper.level = gMinesweeper.levels[0];
    gMinesweeper.board = buildBoard(gMinesweeper.level);
    gMinesweeper.mines = setMines(gMinesweeper.board, gMinesweeper.level.minesNum);
    setTopPane();
    printBoard(gMinesweeper.board);
    renderBoard(gMinesweeper.board);
}

function setTopPane(){
    var topPane = document.querySelector("#top-pane");
    topPane.querySelector("#cells-to-reveal").innerText = gMinesweeper.board.length * gMinesweeper.board[0].length;
    topPane.querySelector("#smiley").innerText = SMILEY_DEFAULT;
    topPane.querySelector("#timer").innerText = '000';
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

function setMines(board, minesNum) {
    var mines = [];
    while (mines.length < minesNum) {
        var cell = board[getRandomInt(0, board.length)][getRandomInt(0, board.length)];
        if (cell.type !== MINE) {
            cell.type = MINE;
            cell.isMine = true;
            mines.push(cell);
        }
    }
    runBoardFor(board, setMinesNegsCount);    
    return mines;
}

function setMinesNegsCount(board, i, j) {
    if (board[i][j].type === MINE) return;
    var range = getNeibougrs(board, i, j); 
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
    elTable.classList.add(`size-${gMinesweeper.level.size}`);
    for (var i = 0; i < board.length; i++) {
        var elTr = document.createElement('tr');
        for (var j = 0; j < board.length; j++) {
            var elTd = document.createElement('td');
            elTd.innerHTML = renderCell(board[i][j]);
            elTd.classList.add('cell', `cell-${i}-${j}`);
            elTd.addEventListener('click', function (ev) {
                cellClicked(board, this, true);
            });
            elTd.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();
                cellMarked(board, this);
                return false;
            }, false);
            elTr.appendChild(elTd);
        }
        elTable.appendChild(elTr);
    }
    var gameBoard = document.querySelector("#game-board");
    if (gameBoard.querySelector('table')) gameBoard.querySelector('table').remove();
    gameBoard.appendChild(elTable);
}

function startGame() {
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
    if (cell.type === MINE) {
        endGame(false);
        return;
    }
    if (gMinesweeper.revealedCount !== gMinesweeper.board.length ** 2) return;

    for (var i = 0; i < gMinesweeper.mines.length; i++) {
        var mine = gMinesweeper.mines[i];
        if (!mine.revealed) return;
    }
    endGame(true);
}

function endGame(isWin) {
    gMinesweeper.isOn = false;
    if (isWin) {
        document.querySelector(".message").innerText = 'Congratulations!'
    }
    else {
        document.querySelector(".message").innerText = 'Sorry!'
    }
    clearInterval(gMinesweeper.timerInterval);
}


