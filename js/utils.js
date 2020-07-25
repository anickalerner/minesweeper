'use strict';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printBoard(board) {
    for (let i = 0; i < board.length; i++) {
        var row = '';
        for (let j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            if (cell.type === MINE) {
                row += MINE;
            }
            else {
                row += cell.minesAround + " ";
            }
        }
        console.log(row);
    }
}

function getNeighbors(board, i, j) {
    var iFrom = Math.max(0, i - 1);
    var iTo = Math.min(i + 1, board.length - 1);
    var jFrom = Math.max(0, j - 1);
    var jTo = Math.min(j + 1, board[0].length - 1);
    return { from: { i: iFrom, j: jFrom }, to: { i: iTo, j: jTo } };
}

function getBoardSize(board) {
    return board.length * board[0].length;
}

function capitalizeFLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
} 