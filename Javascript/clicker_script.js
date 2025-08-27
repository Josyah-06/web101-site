//----Click Me Game----
let score = 0;
const scoreDisplay = document.getElementById("score");
const clickButton = document.getElementById("click button");

clickButton.addEventListener("click", () => {
    score += 1;
    scoreDisplay.textContent = score;
})

//----ROCK PAPER SCISSORS GAME----
const choices = ["rock","paper","scissors"];
const playerchoiceDisplay = document.getElementById("player-choice");
const computerchoiceDisplay = document.getElementById("computer-choice");
const resultDisplay = document.getElementById("rps-result");

document.querySelectorAll(".rps").forEach((button) => {
    button.addEventListener ("click", () =>{
        const playerChoice = button.dataset.choice;
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];

        playerchoiceDisplay.textContent = playerChoice;
        computerchoiceDisplay.textContent = computerChoice;
        resultDisplay.textContent = getResult(playerChoice, computerChoice);
    });
});

function getResult(player, computer) {
    
    player = player.toLowerCase().trim();
    computer = computer.toLowerCase().trim();

    if (player === computer) return "It's a tie!";
    if (
        (player === "rock" && computer === "scissors") ||
        (player === "scissors" && computer === "paper") ||
        (player === "paper" && computer === "rock")
    ) {
        return "You Win";
    } else {
        return "You Lose";
    }
}
