document.addEventListener('DOMContentLoaded', () => {
    const basket = document.getElementById('basket');
    const ball = document.getElementById('ball');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');

    let score = 0;
    let ballSpeed = 2;
    let basketSpeed = 8;
    let gameActive = false;
    let animationId;
    let movingLeft = false;
    let movingRight = false;

    
    startButton.addEventListener('click', () => {
        score = 0;
        ballSpeed = 2; 
        scoreDisplay.textContent = 'Score: 0';
        startButton.style.display = 'none';
        gameActive = true;
        resetBall();
        dropBall();
        moveBasket(); 
    });

    
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        if (e.key === 'ArrowLeft') movingLeft = true;
        if (e.key === 'ArrowRight') movingRight = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') movingLeft = false;
        if (e.key === 'ArrowRight') movingRight = false;
    });

    
    function moveBasket() {
        if (!gameActive) return;

        const basketLeft = parseInt(window.getComputedStyle(basket).getPropertyValue('left'));
        const containerWidth = gameContainer.clientWidth;

        if (movingLeft && basketLeft > 0) {
            basket.style.left = (basketLeft - basketSpeed) + 'px';
        }
        if (movingRight && basketLeft < containerWidth - basket.clientWidth) {
            basket.style.left = (basketLeft + basketSpeed) + 'px';
        }

        requestAnimationFrame(moveBasket); 
    }

    
    function dropBall() {
        if (!gameActive) return;

        const ballTop = parseInt(window.getComputedStyle(ball).getPropertyValue('top'));
        const basketLeft = parseInt(window.getComputedStyle(basket).getPropertyValue('left'));
        const ballLeft = parseInt(window.getComputedStyle(ball).getPropertyValue('left'));

        
        const padding = 10; 

        if (ballTop >= gameContainer.clientHeight - basket.clientHeight - ball.clientHeight) {
            if (
                ballLeft + ball.clientWidth > basketLeft - padding &&
                ballLeft < basketLeft + basket.clientWidth + padding
            ) {
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
                ballSpeed += 0.5; 
                resetBall();
            } else {
                alert('Game Over! Final Score: ' + score);
                resetGame();
            }
        } else {
            ball.style.top = (ballTop + ballSpeed) + 'px';
            animationId = requestAnimationFrame(dropBall);
        }
    }

    
    function resetBall() {
        ball.style.top = '0px';
        ball.style.left = Math.random() * (gameContainer.clientWidth - ball.clientWidth) + 'px';
        dropBall(); 
    }

    
    function resetGame() {
        gameActive = false;
        cancelAnimationFrame(animationId);
        startButton.style.display = 'block'; 
    }
});
