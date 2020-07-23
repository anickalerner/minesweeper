'use strict';

function createCell(i, j) {
    return {
        i: i,
        j: j,
        revealed: false,
        type: EMPTY,
        minesAround: 0,
        isMine: false,
        isMarked: false
    };
}

function renderCell(cell) {
    var spanClass = '';
    var spanText = '';
    if (cell.revealed) {
        switch (cell.type) {
            case NUMBER:
                spanText = cell.minesAround;
                spanClass = ` class="num-${cell.minesAround}"`;
                break;
            case MINE:
                spanText = MINE;
                break;
            case EMPTY:
                spanText = ' ';
                spanClass = ' class="cell-empty"';
                break;
        }
        preventHoverCell(cell);
    }
    else {
        if (cell.isMarked) {
            spanText = FLAG;
        }
        else {
            spanText = ' ';
        }
        markCell(cell);
    }
    return `<span${spanClass}>${spanText}</span>`;
}

function preventHoverCell(cell) {
    var elCell = getCellElementFromModel(cell.i, cell.j);
    elCell.classList.add('disabled');
    elCell.classList.remove('cell-closed');
    markCell(elCell);
}

function markCell(cell) {
    var elCell = getCellElementFromModel(cell.i, cell.j);
    if (elCell) elCell.classList.toggle('cell-closed');
}

function cellClicked(board, elCell) {
    updateCell(board, elCell, false);
}

function cellMarked(board, elCell) {
    updateCell(board, elCell, true);
}

function updateCell(board, elCell, flag) {
    var cell = getCellFromDom(board, elCell);
    if (gMinesweeper.firstClick) {
        var minesToBuild = gMinesweeper.levels[gMinesweeper.currLevel].minesNum;
        gMinesweeper.mines = setMines(gMinesweeper.board, minesToBuild, { i: cell.i, j: cell.j });
        startGame();
    }
    if (!gMinesweeper.isOn) return;

    // right click
    if (flag) {
        toggleFlag(cell);
    }
    else { // left click
        if (cell.revealed) return;
        //if hint mode
        if (gMinesweeper.isHintMode) {
            var cellsToReveal = revealHints(board, cell);
            setTimeout(function(){
                unrevealHints(cellsToReveal);
                removeHint();
            }, 3000);
            return;
        }
        else {
            // reveal cell
            revealCell(board, elCell, cell);
            if (cell.type === EMPTY) {
                // recursion
                expandShown(board, elCell, cell);
            }
        }
    }
    elCell.innerHTML = renderCell(cell);
    checkGameOver(cell);
}

function revealHints(board, cell) {
    var cellsToReveal = [];
    var range = getNeighbors(board, cell.i, cell.j);
    for (var x = range.from.i; x <= range.to.i; x++) {
        for (var y = range.from.j; y <= range.to.j; y++) {
            if (!board[x][y].revealed){
                var newCell = board[x][y];
                cellsToReveal.push(newCell);
                var elCell = getCellElementFromModel(x, y);
                revealCell(board, elCell, newCell);
                elCell.innerHTML = renderCell(newCell);
            }
        }
    }
    return cellsToReveal;
}

function unrevealHints(cells){
    for (var i = 0; i < cells.length; i++){
        var cell= cells[i];
        cell.revealed = false;
        gMinesweeper.revealedCounter--;
        var elCell = getCellElementFromModel(cell.i, cell.j);
        elCell.innerHTML = renderCell(cell);
    }
}

function revealCell(board, elCell, cell){
    cell.revealed = true;
    gMinesweeper.revealedCounter++;
}

function toggleFlag(cell) {
    cell.isMarked = !cell.isMarked;

    if (cell.isMarked) {
        gMinesweeper.markedMinesCounter++;
        updateMinesToRevealCounter(--gMinesweeper.minesToReveal);
    }
    else {
        gMinesweeper.markedMinesCounter--;
        updateMinesToRevealCounter(++gMinesweeper.minesToReveal);
    }
}

function expandShown(board, elCell, cell) {
    var range = getNeighbors(board, cell.i, cell.j);
    for (var x = range.from.i; x <= range.to.i; x++) {
        for (var y = range.from.j; y <= range.to.j; y++) {
            var cell = getCellElementFromModel(x, y);
            updateCell(board, cell, false);
        }
    }
}

function getCellFromDom(board, elCell) {
    var className = elCell.classList[1];
    var cellId = className.split('-');
    return board[cellId[1]][cellId[2]];
}

function getCellElementFromModel(i, j) {
    return document.querySelector(`.cell-${i}-${j}`);
}


