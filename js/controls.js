'use strict';

function setControls(){
    updateSmiley(SMILEY_DEFAULT);
    document.querySelector("#timer").innerText = '000';
    updateMinesToRevealCounter(gMinesweeper.levels[gMinesweeper.currLevel].minesNum);
    setHints();
}

function updateMinesToRevealCounter(num){
    document.querySelector("#mines-to-reveal").innerText = num;
}

function updateSmiley(face){
    document.querySelector("#smiley span").innerText = face;
}

function setLevelsDisplay(levels){
    var elLevels = document.querySelector("#game-levels");
    var itemListStr = '';
    for (var i = 0; i < levels.length; i++){
        var buttonText = `${levels[i].label} (${levels[i].size}x${levels[i].size}, ${levels[i].minesNum} mines)`;
        var buttonAction = `onclick="setGameLevel(${i})"`;
        var buttonStr = `<a href="#" ${buttonAction} class="list-group-item list-group-item-action level-${i}">${buttonText}</a>`;
        itemListStr += buttonStr;
    }
    elLevels.innerHTML = itemListStr;
}

function renderActiveLevelButton(currLevelId){
    if (document.querySelector('#game-levels a.active')){
        document.querySelector('#game-levels a.active').classList.remove('active');
    }
    document.querySelector(`#game-levels a.level-${currLevelId}`).classList.add('active');
}

function setHints(){
    var hintsPane = document.querySelector('#hints');
    var hintStr = '';
    for (var i = 0; i < gMinesweeper.hintCounter; i++){
        hintStr += `<li onclick="revealHint(this)">${HINT}</li>`;
    }
    hintsPane.innerHTML = hintStr;
}

function revealHint(elLi){
    if (elLi.classList.contains('active-hint') && gMinesweeper.isHintMode){
        elLi.classList.remove('active-hint');
        return;
    }
    elLi.classList.add('active-hint');
    gMinesweeper.isHintMode = true;
}

function removeHint(){
    var hint = document.querySelector('#hints li.active-hint');
    if (hint){
        hint.remove();
    }
}