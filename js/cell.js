'use strict';

function createCell(i, j) {
    return {
        i: i,
        j: j,
        revealed: false,
        type: EMPTY,
        minesAround: 0,
        isMine: false
    };
}

function renderCell(cell) {
    var elSpan = '<span>';
    if (cell.revealed) {
        elSpan += (cell.type === NUMBER) ? cell.minesAround : cell.type;
    }
    else {
        elSpan += CLOSEDSQUARE;
    }
    return elSpan += '</span>';
}

function cellClicked(board, elCell) {
    updateCell(board, elCell, false);
}

function cellMarked(board, elCell) {
    updateCell(board, elCell, true);
}

function updateCell(board, elCell, flag) {
    if (!gMinesweeper.isOn && gMinesweeper.timer === 0) {
        startGame();
    }
    if (!gMinesweeper.isOn) return;
    var cell = getCellFromDom(board, elCell);
    if (cell.revealed) return;
    if (flag) {
        cell.type = FLAG;
    }
    cell.revealed = true;
    gMinesweeper.revealedCount++;
    elCell.innerHTML = renderCell(cell);
    if (cell.type === EMPTY){
        expandShown(board, elCell, cell);
    }
    checkGameOver(cell);
}

function expandShown(board, elCell, cell){
    var range = getNeibougrs(board, cell.i, cell.j);
    for (var x = range.from.i; x <= range.to.i; x++) {
        for (var y = range.from.j; y <= range.to.j; y++) {
            var cell = getCellElementFromModel(x, y);
            updateCell(board, cell, false);
            if (board[x][y].type === EMPTY){
                expandShown(board, cell, false);
            }
        }
    }
}

function getCellFromDom(board, elCell){    
    var className = elCell.classList[1];
    var cellId = className.split('-');
    return board[cellId[1]][cellId[2]];
}

function getCellElementFromModel(i, j){
    return document.querySelector(`.cell-${i}-${j}`);
}


