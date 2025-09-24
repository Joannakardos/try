/**
 * We will build this game step by step together.
 * You will make some changes to make it your own.
 * 
 * @todo :
 * - Load current api languages.
 * - Add levels and auto increase word count and length.
 * - Add penalty when user skips word.
 * - Add username associated with the records.
 * - Improve display.
 */
this.onload = async () => {
    /*********************************************
* VARIABLES
********************************************/
    let randomWords = ''; // The words sentence the user needs to type.
    let startTime = 0; // Time the user takes to type the word (updated every millisecond).
    let timerRecorded = 0; // timer record (updated every cents of second).
    let intervalID = 0;// an ID for the Timer so that we can stop it.
    let allRecords = []; // Array of timer recorded.
    let lastWasDead = false; // Trick for ô style double strokes
    /*********************************************
     * CONSTANTS
     ********************************************/
    const apiUrl = "https://random-word-api.herokuapp.com";
    /**
     * get the HTML elements
     */
    const randomWordP = document.querySelector('#randomword');// get the html element for randWord
    const timerP = document.querySelector("#timer");// get the timer P element
    const startBtn = document.querySelector('#startgame');// start button
    const allRecordsOL = document.querySelector('#allRecords'); // list of records
    const nbWordInput = document.querySelector("#nb");
    const lengthInput = document.querySelector("#len");// Récupère l’élément input avec id="len" (longueur des mots)
    const typeWordP = document.querySelector('#typedword');// get the html element for user typed
    // Add an event listener to listen to keyboard type.
    typeWordP.addEventListener('input', onInput);
    startBtn.addEventListener('click', startGame); // listen to click on start button
    document.addEventListener('keydown', (event) => {
        const keyTyped = event.key; // Récupère la touche pressée par l’utilisateur
        if (keyTyped === "Dead") {
            // Trick for ô style double strokes.
            lastWasDead = true;
        } else {
            lastWasDead = false;
            if (keyTyped === "Enter") {
                startGame(); // Lance la partie 
            } else if (timerRecorded > 0 && (event.key === 'Backspace' || event.key === 'Delete')) {
                // Delete or backspace.
                console.log('keydown');
                onInput(null); // Vérifie  le mot après suppression
            }
        }
    });
    async function startGame() {
        clearInterval(intervalID); // Reset the interval loop
        // Get language
        const langInput = document.querySelector("[name='lang']:checked"); // Récupère la langue sélectionnée dans le formulaire
        // Fetch the random from the API.
        randomWords = await getRandomWord(lengthInput.value, nbWordInput.value, langInput.value); // Appelle l’API pour obtenir un mot aléatoire
        randomWordP.textContent = randomWords; // put the random word in the P element
        // Resetting 
        typeWordP.innerHTML = typeWordP.value = ""; // Vide le champ de saisie
        timerRecorded = startTime = 0; // Init times.
        // Start the timer.
        intervalID = setInterval(updateTimer, 50); // Démarre le chronomètre toutes les x ms
        // Stop blinking
        timerP.classList.remove('blink'); // Supprime l’effet clignotant sur le timer
        randomWordP.classList.remove('blink'); // Supprime l’effet clignotant sur le mot
        // Putting the mouse caret in the text box.
        // Oppposite is call blur.
        typeWordP.focus(); // Place le curseur dans la zone de saisie
    }
    /**
     * ==> EXPLAIN 
     * elle réinitialise tout , le timer , le mot a taper , la zone saisie et demare le chrono ,what the function startGame() does ca fait commencer lorsque on appuie sur enter 
     * @param event
     */
    function onInput(event) {
        let typedString = typeWordP.textContent; // Récupère le texte
        if (event == null) {
            typedString = typedString.slice(-1); // alors la c'est une bonne question jsp 
        }
        checkWord(typedString); // ca vérifie si le mot tapé correspond
        if (!lastWasDead) {
            randomWordP.innerHTML = wordHighlighter(typedString); // Met à jour l’affichage avec lettres correctes/incorrectes
        }
    }
    /**
     * ==> EXPLAIN
     * elle recupere ce que on a taper et verifie si le  mot est terminer et met en vert ou rouges les letrres incorects
     * @param text
     * @returns {string}
     */
    function wordHighlighter(text) {
        // je crois le but c'est de compparer  les lettres tapées avec celles du mot cible
        // Retourne vert si  les lettres correctes et en rouge les lettres fausses
        let displayText = '';
        let end = randomWords.substring(text.length); // jsp
        // console.log(text, end);
        for (let i = 0; i < text.length; i++) {
            // Loop through all char of typed and compare to the current word
            // and replace spaces by non breaking spaces...??
            const charA = text[i].replace(/ /g, '\u00A0').charCodeAt(0); // Code du caractère tapé
            const charB = randomWords[i].replace(/ /g, '\u00A0').charCodeAt(0); // Code du caractère attendu
            console.log(text[i], text[i] == ' ', charA, randomWords[i] == ' ', charB);
            if (charA == charB) {
                displayText += `<span class="correct">${randomWords[i]}</span>`; // Ajoute le caractère correct en vert
            } else {
                displayText += `<span class="wrong">${randomWords[i]}</span>`; // Ajoute le caractère incorrect en rouge
            }
        }
        return displayText + end; // Retourne le mot avec mise en évidence
    }
    /**
     * ==> EXPLAIN elle compare lettre par lettre avec le mot ciblé et retourne une vision stylysé du mot 
     * @param {String} typed
     */
    function checkWord(typed) {
        //==> EXPLAIN THIS if BLOCK OF CODE (these 4 lines below)
        if (typed === randomWords) { // Vérifie si le mot tapé correspond EN ENTIER  au mot attendu
            clearInterval(intervalID); // Stopppe le chronomètre
            typeWordP.blur(); //  le curseur  il part loin la bas du champ de saisie
            timerP.setAttribute("class", "blink"); // je crois que ca fait  clignoter le timer pour signaler la fin
            randomWordP.classList.add("blink"); // alors la jsp 
            allRecords.push({ time: timerRecorded, word: typed }); // Ajoute le temps et le mot dans le tableau des records
            allRecords.sort((a, b) => a.time - b.time); // Trie les records du plus rapide au plus lent
            allRecordsOL.innerHTML = ""; // Vide la liste affichée des records
            allRecords.forEach(element => { // Réaffiche chaque record  MAIS trié attention
                const li = document.createElement("li");
                li.textContent = `${element.time}s (${element.word})`;
                allRecordsOL.appendChild(li);
            });
            timerRecorded = startTime = 0; // Réinitialise le  temps
        }
    }
    /**
     * ==> EXPLAIN verifie  si le mot tapper est bien le mot 
     * @param lngth
     * @param nmber
     * @param lng
     * @returns {Promise<*>}
     */
    async function getRandomWord(lngth, nmber, lng) {
        // Fonction qui appelle l’API pour récupérer des mots aléatoires selon longueur, nombre et langue
        console.log(lng); // Affiche la langue choisie dans la console
        const url = `${apiUrl}/word?length=${lngth}&number=${nmber}&lang=${lng}`; // URL avec paramètres
        // Call http.
        const response = await fetch(url); // Effectue la requête HTTP
        // Get the rsponse data.
        const data = await response.json(); // Convertit la réponse en qqlch donc je comprens pas 
        // Return the data to the function call.
        return data.join(" "); // Transform en phrase
    }
    async function getRandomWord(lngth, nmber, lng) {
        // Fonction qui appelle l’API pour récupérer des mots aléatoires selon longueur, nombre et langue
        console.log(lng); // Affiche la langue choisie dans la console
        const url = `${apiUrl}/word?length=${lngth}&number=${nmber}&lang=${lng}`; // URL avec paramètres
        // Call http.
        const response = await fetch(url); // Effectue la requête HTTP
        // Get the rsponse data.
        const data = await response.json(); // Convertit la réponse en qqlch donc je comprens pas 
        // Return the data to the function call.
        return data.join(" "); // Transform en phrase
    }
}
