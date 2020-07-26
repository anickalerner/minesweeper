'use strict';

function createCell(i, j) {
    return {
        i: i,
        j: j,
        revealed: false,
        type: EMPTY,
        minesAround: 0,
        isMarked: false,
        isStepped: false
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
            case EMPTY:
                spanText = ' ';
                spanClass = ' class="cell-empty"';
                break;
            case MINE: // in a hint mode
                spanText = MINE;
                break;
        }
        preventHoverCell(cell);
    }
    else {
        if (cell.isMarked) {
            spanText = FLAG;
        }
        else if (cell.isStepped){
            spanText = MINE;
        }
        else {
            spanText = ' ';
        }
        var elCell = getCellElementFromModel(cell.i, cell.j);
        if (elCell) elCell.classList.toggle('cell-closed');

    }
    return `<span${spanClass}>${spanText}</span>`;
}

function preventHoverCell(cell) {
    var elCell = getCellElementFromModel(cell.i, cell.j);
    if (elCell) {
        elCell.classList.add('disabled');
        elCell.classList.remove('cell-closed');
    }
}

function cellLeftClicked(board, elCell) {
    cellClicked(board, elCell, false);
}

function cellRightClicked(board, elCell) {
    cellClicked(board, elCell, true);
}

function cellClicked(board, elCell, isRightClick) {
    var cell = getCellFromDom(board, elCell);
    updateCell(board, elCell, cell, isRightClick);
    checkGameOver(cell);
}

function updateCell(board, elCell, cell, flag) {
    if (gMinesweeper.firstClick) {
        var minesToBuild = gMinesweeper.levels[gMinesweeper.currLevel].minesNum;
        gMinesweeper.mines = setMines(gMinesweeper.board, minesToBuild, { i: cell.i, j: cell.j });
        startGame();
    }
    if (!gMinesweeper.isOn) return;
    if (cell.isStepped) return;
    // right click
    if (flag) {
        toggleFlag(cell);
    }
    else { // left click
        if (cell.revealed) return;
        //if hint mode
        if (gMinesweeper.isHintMode) {
            var cellsToReveal = revealHints(board, cell);
            setTimeout(function () {
                unrevealHints(cellsToReveal);
                removeHint();
            }, 1000);
            return;
        }
        else {
            switch (cell.type) {
                case MINE:
                    if (cell.isMarked) return;
                    if (gMinesweeper.livesCounter >= 1) {
                        cell.isStepped = true;
                        updateMinesToRevealCounter(--gMinesweeper.minesToReveal);
                        loseLife();
                    }
                    else {
                        endGame(false);
                    }
                    break;
                case EMPTY:
                    revealCell(cell);
                    // recursion
                    expandShown(board, cell);
                    break;
                case NUMBER:
                    revealCell(cell);
                    break;
            }

        }
    }
    elCell.innerHTML = renderCell(cell);
}

function revealHints(board, cell) {
    var cellsToReveal = [];
    var range = getNeighbors(board, cell.i, cell.j);
    for (var x = range.from.i; x <= range.to.i; x++) {
        for (var y = range.from.j; y <= range.to.j; y++) {
            if (!board[x][y].revealed) {
                var newCell = board[x][y];
                cellsToReveal.push(newCell);
                var elCell = getCellElementFromModel(x, y);
                revealCell(newCell);
                elCell.innerHTML = renderCell(newCell);
            }
        }
    }
    return cellsToReveal;
}

function unrevealHints(cells) {
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.revealed = false;
        gMinesweeper.revealedCounter--;
        gMinesweeper.isHintMode = false;
        var elCell = getCellElementFromModel(cell.i, cell.j);
        elCell.innerHTML = renderCell(cell);
    }
}

function revealCell(cell) {
    if (!cell.revealed) {
        cell.revealed = true;
        gMinesweeper.revealedCounter++;
        //console.log(cell.i + ' ' + cell.j + ' is revealed. Counter: ' + gMinesweeper.revealedCounter);
    }
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

function expandShown(board, cell) {
    var range = getNeighbors(board, cell.i, cell.j);
    for (var x = range.from.i; x <= range.to.i; x++) {
        for (var y = range.from.j; y <= range.to.j; y++) {
            var cell = board[x][y];
            var elCell = getCellElementFromModel(x, y);
            updateCell(board, elCell, cell, false);
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


