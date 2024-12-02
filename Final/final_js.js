
const spaceship = document.getElementById('spaceship');
const gameContainer = document.getElementById('game-container');


let spaceshipX = window.innerWidth / 2;
let spaceshipY = window.innerHeight - 70;
let speed = 10; 
let acceleration = 0.7;
let maxSpeed = 18;
let keysPressed = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

let health = 100;
let score = 0;
let frameCount = 0;

let currentLevel = 1;
const largeAsteroidChance = 0.3; 
let treasureSpawnInterval = 200;

const asteroids = [];
const asteroidCount = 20; 
let treasures = [];


const baseAsteroidSpeed = {
  small: 5, 
  large: 4, 
};


const dynamicAsteroidSpeedAdjustment = {
  forward: 2, 
  backward: -1, 
};


function increaseDifficulty() {
  currentLevel = 2;
  treasureSpawnInterval = 120;
  asteroids.forEach((asteroid) => {
    asteroid.speed += 2; 
  });
  alert('Welcome to Level 2! Get ready for a challenge!');
}


function createAsteroids() {
  for (let i = 0; i < asteroidCount; i++) {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');

    
    const isLarge = Math.random() < largeAsteroidChance;
    asteroid.classList.toggle('large-asteroid', isLarge);

    
    asteroid.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    asteroid.style.top = `${-Math.random() * 500}px`;
    gameContainer.appendChild(asteroid);

    asteroids.push({
      element: asteroid,
      speed: isLarge
        ? baseAsteroidSpeed.large
        : baseAsteroidSpeed.small,
      size: isLarge ? 'large' : 'small',
    });
  }
}


function createTreasure() {
  const treasure = document.createElement('div');
  treasure.classList.add('treasure');

  const minY = window.innerHeight * 0.3;
  const maxY = window.innerHeight - 100;

  treasure.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  treasure.style.top = `${Math.random() * (maxY - minY) + minY}px`;
  gameContainer.appendChild(treasure);

  treasures.push({
    element: treasure,
    timer: 200,
  });
}


function updateTreasures() {
  treasures.forEach((treasure, index) => {
    treasure.timer--;

    if (checkCollision(treasure.element, spaceship)) {
      score += 100;
      updateScore();
      treasure.element.remove();
      treasures.splice(index, 1);
    }

    if (treasure.timer <= 0) {
      treasure.element.remove();
      treasures.splice(index, 1);
    }
  });
}


function updateAsteroids() {
  const playerDirection = getPlayerDirection();

  asteroids.forEach((asteroid) => {
    const currentTop = parseFloat(asteroid.element.style.top);

    
    const adjustedSpeed =
      asteroid.speed +
      (playerDirection === 'forward'
        ? dynamicAsteroidSpeedAdjustment.forward
        : playerDirection === 'backward'
        ? dynamicAsteroidSpeedAdjustment.backward
        : 0);

    if (currentTop > window.innerHeight) {
      resetAsteroid(asteroid);
    } else {
      asteroid.element.style.top = `${currentTop + adjustedSpeed}px`;
    }

    if (checkCollision(asteroid.element, spaceship)) {
      health -= asteroid.size === 'large' ? 20 : 10;
      updateHealth();
      resetAsteroid(asteroid);
    }
  });
}


function getPlayerDirection() {
  if (keysPressed.ArrowUp) return 'forward';
  if (keysPressed.ArrowDown) return 'backward';
  return 'idle';
}


function resetAsteroid(asteroid) {
  asteroid.element.style.top = `${-50}px`;
  asteroid.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  asteroid.speed = asteroid.size === 'large'
    ? baseAsteroidSpeed.large
    : baseAsteroidSpeed.small;
}


function checkCollision(a, b) {
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right ||
    rect1.right < rect2.left
  );
}


function updateHealth() {
  document.getElementById('health').textContent = health;
  if (health <= 0) {
    alert(`Game Over! Final Score: ${score}`);
    window.location.reload();
  }
}


function updateScore() {
  document.getElementById('score').textContent = score;
  if (score >= 1000 && currentLevel === 1) {
    increaseDifficulty();
  }
}


function updateSpaceshipPosition() {
  if (keysPressed.ArrowLeft && spaceshipX > 0) spaceshipX -= speed;
  if (keysPressed.ArrowRight && spaceshipX < window.innerWidth - 50) spaceshipX += speed;
  if (keysPressed.ArrowUp && spaceshipY > 0) spaceshipY -= speed;
  if (keysPressed.ArrowDown && spaceshipY < window.innerHeight - 50) spaceshipY += speed;

  spaceship.style.left = `${spaceshipX}px`;
  spaceship.style.top = `${spaceshipY}px`;
}


function gameLoop() {
  frameCount++;

  updateSpaceshipPosition();
  updateAsteroids();
  updateTreasures();

  if (frameCount % treasureSpawnInterval === 0) {
    createTreasure();
  }

  requestAnimationFrame(gameLoop);
}


createAsteroids();
updateSpaceshipPosition();
gameLoop();


document.addEventListener('keydown', (e) => {
  if (keysPressed[e.key] !== undefined) keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (keysPressed[e.key] !== undefined) keysPressed[e.key] = false;
});
