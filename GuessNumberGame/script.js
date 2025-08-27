let secret = Math.floor(Math.random() * 100) + 1;
console.log("Secret (for grading):", secret); 

let guesses = [];
let gameOver = false;

const my_button   = document.getElementById('my_button');
const input       = document.getElementById('my_input');
const feedback    = document.getElementById('feedback');
const guessCount  = document.getElementById('guessCount');
const historyList = document.getElementById('history');
const winGif      = document.getElementById('winGif');
const playAgain   = document.getElementById('playAgain');

function parseValidGuess(raw) {
  const trimmed = String(raw).trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = parseInt(trimmed, 10);
  if (Number.isNaN(n) || n < 1 || n > 100) return null;
  return n;
}

function setFeedback(msg, type = "") {
  feedback.className = `feedback ${type}`.trim();
  feedback.textContent = msg;
}

function updateHistory() {
  historyList.innerHTML = "";
  for (const g of guesses) {
    const li = document.createElement('li');
    li.textContent = g;
    historyList.appendChild(li);
  }
}

function submitGuess() {
  if (gameOver) return;

  const guess = parseValidGuess(input.value);
  input.value = "";

  if (guess === null) {
    setFeedback("Please enter an integer from 1 to 100.", "error");
    return;
  }

  guesses.push(guess);
  guessCount.textContent = `Guesses: ${guesses.length}`;
  updateHistory();

  if (guess < secret) {
    setFeedback("Too low!", "hint");
  } else if (guess > secret) {
    setFeedback("Too high!", "hint");
  } else {
    gameOver = true;
    setFeedback(`🎉 Correct! You got it in ${guesses.length} guesses.`, "win");

    winGif.innerHTML = `<img src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" alt="You win!" />`;

    playAgain.hidden = false;
  }
}

my_button.addEventListener('click', submitGuess);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });
input.addEventListener('input', () => {
  input.value = input.value.replace(/[^\d]/g, '').slice(0, 3);
});

playAgain.addEventListener('click', () => {
  secret = Math.floor(Math.random() * 100) + 1;
  console.log("New Secret (for grading):", secret);
  guesses = [];
  gameOver = false;
  input.value = "";
  guessCount.textContent = "Guesses: 0";
  setFeedback("New game started! Guess a number between 1 and 100.");
  winGif.innerHTML = "";
  historyList.innerHTML = "";
  playAgain.hidden = true;
  input.focus();
});

setFeedback("Enter a number between 1 and 100 to begin.");
input.focus();
