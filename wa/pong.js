const basket = document.getElementById('basket');
const ball = document.getElementById('ball');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let ballSpeed = 2; // Ball falling speed
let basketSpeed = 15; // Basket moving speed
let gameActive = false; // Track if the game is active

// Start the game when the button is clicked
startButton.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    startButton.style.display = 'none'; // Hide the button after starting the game
    gameActive = true;
    resetBall();
    dropBall();
});

// Move the basket using arrow keys
document.addEventListener('keydown', (e) => {
    if (!gameActive) return; // Prevent movement if the game hasn't started

    const basketLeft = parseInt(window.getComputedStyle(basket).getPropertyValue('left'));
    const containerWidth = gameContainer.clientWidth;

    if (e.key === 'ArrowLeft' && basketLeft > 0) {
        basket.style.left = (basketLeft - basketSpeed) + 'px';
    }
    if (e.key === 'ArrowRight' && basketLeft < containerWidth - basket.clientWidth) {
        basket.style.left = (basketLeft + basketSpeed) + 'px';
    }
});

// Drop the ball
function dropBall() {
    if (!gameActive) return; // Stop dropping the ball if the game isn't active

    const ballTop = parseInt(window.getComputedStyle(ball).getPropertyValue('top'));
    const basketLeft = parseInt(window.getComputedStyle(basket).getPropertyValue('left'));
    const ballLeft = parseInt(window.getComputedStyle(ball).getPropertyValue('left'));

    if (ballTop >= gameContainer.clientHeight - basket.clientHeight - ball.clientHeight) {
        // Check if the ball is caught
        if (ballLeft >= basketLeft && ballLeft <= basketLeft + basket.clientWidth) {
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
            resetBall();
        } else {
            alert('Game Over! Final Score: ' + score);
            resetGame();
        }
    } else {
        ball.style.top = (ballTop + ballSpeed) + 'px';
        requestAnimationFrame(dropBall);
    }
}

// Reset the ball to the top
function resetBall() {
    ball.style.top = '0px';
    ball.style.left = Math.random() * (gameContainer.clientWidth - ball.clientWidth) + 'px';
}

// Reset the game
function resetGame() {
    gameActive = false;
    startButton.style.display = 'block'; // Show
