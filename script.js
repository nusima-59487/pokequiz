// fetch from https://raw.githubusercontent.com/Purukitto/pokemon-data.json/refs/heads/master/pokedex.json
var score = 0;
var data; 
fetch("https://raw.githubusercontent.com/Purukitto/pokemon-data.json/refs/heads/master/pokedex.json")
  .then((response) => response.json())
  .then((ddd) => {
    data = ddd; 
    console.log(data);
  });

function randomize() {
  let random = Math.floor(Math.random() * data.length);
  console.log(data[random]);
  return data[random];
}

function nextEntry() {
    htmlImg = document.getElementById("mainimg"); 
    htmlName = document.getElementById("pokemonname");

    ent = randomize();
    entImg = ent["image"]["hires"];
    entName = ent["name"]["english"];
    htmlImg.src = entImg;
    htmlName.innerHTML = entName;
}

/**
 * Get the high score from localstorage
 * @returns {number} the high score
 */
function getHighScore () {
    s = localStorage.getItem('highscore')
    if (s == null) {
        localStorage.setItem('highscore', 0);
        return 0;
    }
    return s;
}

/**
 * Set the high score to localstorage
 * @param {number} score score to set as high score
 * @returns {boolean} true if successful, false if score lower than current high score
 */
function setHighScore (score) {
    let currentHighScore = getHighScore();
    if (score < currentHighScore) {
        return false;
    }
    localStorage.setItem('highscore', score);
    return true; 
}


// Button functions mapping
function btnUserConfirm() {

}

function btnUserGiveup () {

}

function btnUserSkip () {

}

function btnRetry () {

}