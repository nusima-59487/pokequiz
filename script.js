async function fetchData() {
    var toreturn; 
    await fetch("https://raw.githubusercontent.com/Purukitto/pokemon-data.json/refs/heads/master/pokedex.json")
        .catch((error) => {
            console.error('Error from fetching data:', error);
            alert("An error occured. Please try again later.");
            return;
        })
        .then((response) => response.json())
        .then((data) => {
            toreturn = data; 
        });
    return toreturn; 
}; 

class game {
    constructor (data) {
        this.score = 0; 
        this.data = data; // data from the fetch
        this.entry = null; 
        this.isGameOver = false;

        // might use constructor params
        this.htmlImg = document.getElementById("mainimg");
        this.htmlName = document.getElementById("pokemonname");
        this.htmlInput = document.getElementById("userinput");
        this.htmlScore = document.getElementById("score");
        this.htmlHigh = document.getElementById("high");
        this.htmlInputDiv = document.getElementById("userinputdiv");
        this.htmlGiveupDiv = document.getElementById("usergiveupdiv");

        this.stats = {
            score: 0,
            highScore: 0,
            consecutive: 0, 
            highestConsecutive: 0,
            totalEntriesGuessed: 0,
            totalEntriesGuessedCorrect: 0,
            totalEntriesSkipped: 0, 
            totalEntriesGuessedWrong: 0,
        }
    }

    /**
     * Gets random entry from `game.data` 
     * @returns {object} random entry from the data
     */
    random() {
        let random = Math.floor(Math.random() * this.data.length);
        // console.log(this.#data[random]);
        return this.data[random];
    }

    /**
     * Get the next entry from the data and display it
     * 
     * [only if game in progress]
     */
    nextEntry() {
        if (this.isGameOver) return; // if gameover, do nothing    
        this.entry = this.random();
        let entImg = this.entry["image"]["hires"];
        this.htmlImg.src = entImg;

        // show score and reset input box
        this.htmlScore.innerText = this.stats.score;  
        this.htmlHigh.innerText = this.getHighScore();  
        this.htmlInput.value = ""; 
        this.htmlInput.focus(); // focus on input box

        // plz dont
        console.log(this.entry["name"]["english"]);
    }

    /**
     * Checks the answer from `#userinput`
     * 
     * [only if game in progress]
     */
    checkAnswer() {
        if (this.isGameOver) return; // if gameover, do nothing
        let input = this.htmlInput.value.toLowerCase();
        let entName = this.entry["name"]["english"].toLowerCase();

        if (input == entName) {
            this.stats.score++;
            let a = this.setHighScore(score);

            this.nextEntry();
        } else {
            this.endgame(); 
        }
    }

    /**
     * Ends the game
     * @returns {string} the name of the entry
     */
    endgame () {
        let entName = this.entry["name"]["english"];
        this.isGameOver = true; 
        this.htmlInputDiv.hidden = true;
        this.htmlGiveupDiv.hidden = false;
        this.htmlName.innerText = entName;
        return entName;
    }

    /**
     * @todo
     */
    skipEntry () {
        this.nextEntry()
    }

    retry () {
        this.isGameOver = false; 
        this.htmlInputDiv.hidden = false;
        this.htmlGiveupDiv.hidden = true;
        this.htmlName.innerHTML = "";
        this.stats.score = 0;
        this.htmlScore.innerText = this.stats.score;    

        return this.nextEntry();
    }

    /**
     * Get the high score from `localStorage`, set 0 if null
     * @returns {number} the high score
     */
    getHighScore () {
        let s = localStorage.getItem('highscore')
        if (s == null) {
            localStorage.setItem('highscore', 0);
            return 0;
        }
        return s;
    }

    /**
     * Set the high score to `localStorage`
     * @returns {boolean} true if successful, false if score lower than current high score
     */
    setHighScore () {
        let currentHighScore = this.getHighScore();
        if (this.stats.score < currentHighScore) {
            return false;
        }
        localStorage.setItem('highscore', this.stats.score);
        return true; 
    }

}


// Button functions mapping
function btnUserConfirm() {
    g1.checkAnswer();
}

function btnUserGiveup () {
    g1.endgame(); 
}

function btnUserSkip () {
    g1.skipEntry(); 
}

function btnRetry () {
    g1.retry();
}



