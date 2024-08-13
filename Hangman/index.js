const words = ['javascript', 'programming', 'hangman', 'developer', 'openai', 'react', 'node', 'express'];
let selectedWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let remainingAttempts = 6;

const wordDisplay = document.getElementById('wordDisplay');
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const hangmanParts = document.querySelectorAll('.hangman > div');

function initializeGame() {
    wordDisplay.textContent = '_ '.repeat(selectedWord.length);
    guessedLetters = [];
    remainingAttempts = 6;
    hangmanParts.forEach(part => part.style.display = 'none'); // Hide all parts initially
    guessInput.disabled = false;
    guessButton.disabled = false;
    document.body.style.backgroundColor = '#4b4949'; // Default background color
}

function handleGuess() {
    const guess = guessInput.value.toLowerCase();
    guessInput.value = '';
    
    if (!guess || guessedLetters.includes(guess)) return;

    guessedLetters.push(guess);
    
    if (selectedWord.includes(guess)) {
        updateWordDisplay();
        if (wordDisplay.textContent.replace(/ /g, '') === selectedWord) {
            endGame(true);
        }
    } else {
        showHangmanPart();
        if (remainingAttempts === 0) {
            endGame(false);
        }
    }
}

function updateWordDisplay() {
    const displayText = selectedWord.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
    wordDisplay.textContent = displayText;
}

function showHangmanPart() {
    hangmanParts[6 - remainingAttempts].style.display = 'block';
    remainingAttempts--;
}

function endGame(isWin) {
    guessInput.disabled = true;
    guessButton.disabled = true;
    
    if (isWin) {
        document.body.style.backgroundColor = 'green';
        wordDisplay.textContent = 'Congratulations! You won!';
    } else {
        document.body.style.backgroundColor = 'red';
        wordDisplay.textContent = 'Game over! You lost.';
    }
}

guessButton.addEventListener('click', handleGuess);

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});

initializeGame();
