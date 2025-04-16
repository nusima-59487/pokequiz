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
    constructor (data, localStorageKey = "gamestats") {
        this.data = data; // data from the fetch
        this.entry = null; 
        this.isGameOver = false;
        this.LOCAL_STORAGE_KEY = localStorageKey; 

        // might use constructor params
        this.htmls = {
            img: document.getElementById("mainimg"), 
            name: document.getElementById("pokemonname"), 
            input: document.getElementById("userinput"), 
            score: document.getElementById("score"), 
            highScore: document.getElementById("high"), 
            consecutive: document.getElementById("consecutive"),
            inputDiv: document.getElementById("userinputdiv"), 
            giveupDiv: document.getElementById("usergiveupdiv"), 
            saveIndicator: document.getElementById("saveindicator"),
        }

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
        this.htmls.img.src = entImg;

        // show score and reset input box
        this.htmls.score.innerText = this.stats.score;  
        this.htmls.highScore.innerText = this.stats.highScore;  
        this.htmls.consecutive.innerText = this.stats.consecutive;
        this.htmls.input.value = ""; 
        this.htmls.input.focus(); // focus on input box

        // plz dont
        // console.log(this.entry["name"]["english"]);
    }

    /**
     * Checks the answer from `#userinput`
     * 
     * [only if game in progress]
     */
    checkAnswer() {
        if (this.isGameOver) return; // if gameover, do nothing
        let input = this.htmls.input.value.toLowerCase();
        let entName = this.entry["name"]["english"].toLowerCase();

        this.stats.totalEntriesGuessed++;
        if (input == entName) {
            this.stats.score++;
            this.stats.consecutive++;
            this.stats.totalEntriesGuessedCorrect++;
            if (this.stats.score > this.stats.highScore) 
                this.stats.highScore = this.stats.score;
            if (this.stats.consecutive > this.stats.highestConsecutive)
                this.stats.highestConsecutive = this.stats.consecutive;

            this.nextEntry();
        } else {
            this.stats.totalEntriesGuessedWrong++;
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
        this.htmls.inputDiv.hidden = true;
        this.htmls.giveupDiv.hidden = false;
        this.htmls.name.innerText = entName;

        this.writeStats(); 
        return entName;
    }

    skipEntry () {
        this.stats.totalEntriesSkipped++;
        this.stats.consecutive = 0;
        this.nextEntry()
    }

    retry () {
        this.isGameOver = false; 
        this.htmls.inputDiv.hidden = false;
        this.htmls.giveupDiv.hidden = true;
        this.htmls.name.innerHTML = "";
        this.stats.score = 0;
        this.stats.consecutive = 0;
        this.htmls.score.innerText = this.stats.score;    

        return this.nextEntry();
    }

    /**
     * Get the `stats` object from `localStorage`, init if null
     * @todo
     */
    readStats () {
        let s = localStorage.getItem(this.LOCAL_STORAGE_KEY); 
        if (s == null) return; 
        this.stats = JSON.parse(s);
        this.stats.score = 0; 
        this.stats.consecutive = 0; 
        return; 
    }
    
    /**
     * Update the `stats` object to `localStorage`
     */
    writeStats () {
        this.htmls.saveIndicator.hidden = false;
        // fake loading
        setTimeout(() => {
            this.htmls.saveIndicator.hidden = true;
        }, 473);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.stats));
        return;
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



