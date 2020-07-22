'use strict';

function getRandomInt(min, max) {
	return Math.floor(Math.random()*(max-min)) + min;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printBoard(board){
    for (let i = 0; i < board.length; i++) {
        var row = '';
        for (let j = 0; j < board.length; j++) {
            var cell = board[i][j];
            if (cell.type === MINE){
                row += MINE;
            }
            else{
                row+=cell.minesAround + " ";
            }
        }
        console.log(row);
    }
}

function runBoardFor(board, func){
    for (var i = 0; i < board.length; i++){
        for (var j = 0; j < board.length; j++){
            func(board, i, j);
        }
    }
}

function getNeibougrs(board, i, j){
    var iFrom = Math.max(0, i - 1);
    var iTo = Math.min(i + 1, board.length - 1);
    var jFrom = Math.max(0, j - 1);
    var jTo = Math.min(j + 1, board.length - 1);
    return {from: {i: iFrom, j: jFrom}, to: {i: iTo, j: jTo}};
}
