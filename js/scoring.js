'use strict';

function checkBestScore(timer, currLevelLabel) {
    var level = currLevelLabel.toLowerCase();
    var bestScores = [];

    if (localStorage.getItem(`minesweeper-${level}`)) {
        bestScores = JSON.parse(localStorage.getItem(`minesweeper-${level}`));
        if (!bestScores) bestScores = [];
    }
    if (bestScores.length === gMinesweeper.bestScoresTableSize && timer > bestScores[bestScores.length - 1]) {
        return;
    }
    var newIndex = Math.max(bestScores.length, 0);
    for (var index = 0; index < bestScores.length; index++) {
        if (timer < bestScores[index].time) {
            newIndex = index;
            break;
        }
    }
    gMinesweeper.bestScore = { level: level, time: timer, index: newIndex, bestScores: bestScores };
    renderUserNameInput();
}

function renderUserNameInput() {
    document.querySelector('#playerName').style.display = 'block';
    document.querySelector('#playerName input').focus();
}

function submitUsername(ev){
    if (ev.keyCode === 13 && document.querySelector('#playerName input').value !== ''){
        insertToBestScores();
    }
}

function insertToBestScores() {
    var name = document.querySelector('#playerName input').value;
    var score = gMinesweeper.bestScore;
    score.bestScores.splice(score.index, 0, { name: name, time: score.time });
    localStorage.setItem(`minesweeper-${score.level}`, JSON.stringify(score.bestScores));
    document.querySelector('#playerName input').value = '';
    document.querySelector('#playerName').style.display = 'none';
    setBestScoresTable(score.level)
}

function setBestScoresTable(level) {
    if (document.querySelector('#bestScores table')) document.querySelector('#bestScores table').remove();
    document.querySelector('#bestScores').style.display = 'none';
    var level = level.toLowerCase();
    if (localStorage.getItem(`minesweeper-${level}`)) {
        var bestScores = JSON.parse(localStorage.getItem(`minesweeper-${level}`));
        if (bestScores){
            document.querySelector('#bestScores').style.display = 'block';
            document.querySelector('#bestScores h4').innerText = `Best Scores for the ${capitalizeFLetter(level)} Level`;
            renderBestScores(bestScores);
        }
    }
}


function renderBestScores(bestScores) {
    var elTable = document.createElement('table');
    elTable.classList.add('table', 'table-striped');
    var thead = '<thead><tr><th>#</th><th>Name</th><th>Score</th></tr></thead>';
    elTable.innerHTML = thead;
    for (var index = 0; index < bestScores.length; index++) {
        var elRow = document.createElement('tr');
        var score = bestScores[index];
        var tdIndex = document.createElement('td');
        tdIndex.innerText = index;
        var tdName = document.createElement('td');
        tdName.innerText = score.name;
        var tdScore = document.createElement('td');
        tdScore.innerText = score.time;
        elRow.appendChild(tdIndex);
        elRow.appendChild(tdName);
        elRow.appendChild(tdScore);
        elTable.appendChild(elRow);
    }
    document.querySelector('#bestScores').appendChild(elTable);
}