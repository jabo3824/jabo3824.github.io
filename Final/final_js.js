// Selectors
const spaceship = document.getElementById('spaceship');
const gameContainer = document.getElementById('game-container');
const banner = document.createElement('div');
banner.id = 'banner';
banner.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  font-size: 24px;
  text-align: center;
  z-index: 1000;
  display: none;
`;
document.body.appendChild(banner);

// Initial Variables
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

// Base asteroid speeds
const baseAsteroidSpeed = {
  small: 5,
  large: 4,
};

// Speed adjustment based on player movement
const dynamicAsteroidSpeedAdjustment = {
  forward: 2,
  backward: -1,
};

// Colors for each level
const levelColors = {
  1: { background: '#000020', smallAsteroid: '#ff5733', largeAsteroid: '#c70039' },
  2: { background: '#001a33', smallAsteroid: '#33ff57', largeAsteroid: '#39c700' },
  3: { background: '#33001a', smallAsteroid: '#5733ff', largeAsteroid: '#0039c7' },
};

// Function to Display Banner
function showBanner(message) {
  banner.textContent = message;
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 2000);
}

// Function to Increase Difficulty and Change Colors
function increaseDifficulty() {
  currentLevel++;
  treasureSpawnInterval -= 40;

  asteroids.forEach((asteroid) => {
    asteroid.speed += 4;
  });

  applyLevelColors();
  showBanner(`Welcome to Level ${currentLevel}!`);
}

// Apply Level-Specific Colors
function applyLevelColors() {
  const colors = levelColors[currentLevel];
  if (colors) {
    // Update background color
    gameContainer.style.backgroundColor = colors.background;

    // Update asteroid colors
    asteroids.forEach((asteroid) => {
      asteroid.element.style.backgroundColor =
        asteroid.size === 'large' ? colors.largeAsteroid : colors.smallAsteroid;
    });
  }
}

// Create Asteroids with Default Spawn Logic
function createAsteroids() {
  for (let i = 0; i < asteroidCount; i++) {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');

    const isLarge = Math.random() < largeAsteroidChance;
    asteroid.classList.toggle('large-asteroid', isLarge);

    asteroid.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    asteroid.style.top = `${-Math.random() * 500}px`;
    asteroid.style.backgroundColor = isLarge
      ? levelColors[currentLevel].largeAsteroid
      : levelColors[currentLevel].smallAsteroid;

    gameContainer.appendChild(asteroid);

    asteroids.push({
      element: asteroid,
      speed: isLarge ? baseAsteroidSpeed.large : baseAsteroidSpeed.small,
      size: isLarge ? 'large' : 'small',
    });
  }
}

// Create Treasures
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

// Update Treasures
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

// Update Asteroids with Dynamic Speed Adjustment
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

// Determine Player Direction
function getPlayerDirection() {
  if (keysPressed.ArrowUp) return 'forward';
  if (keysPressed.ArrowDown) return 'backward';
  return 'idle';
}

// Reset Asteroid Position and Properties
function resetAsteroid(asteroid) {
  asteroid.element.style.top = `${-50}px`;
  asteroid.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  asteroid.speed = asteroid.size === 'large' ? baseAsteroidSpeed.large : baseAsteroidSpeed.small;

  asteroid.element.style.backgroundColor =
    asteroid.size === 'large'
      ? levelColors[currentLevel].largeAsteroid
      : levelColors[currentLevel].smallAsteroid;
}

// Collision Detection
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

// Update Health
function updateHealth() {
  document.getElementById('health').textContent = health;
  if (health <= 0) {
    showBanner(`Game Over! Final Score: ${score}`);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

// Update Score
function updateScore() {
  document.getElementById('score').textContent = score;
  if (score >= 200 * currentLevel && currentLevel < 3) {
    increaseDifficulty();
  }
}

// Update Spaceship Position
function updateSpaceshipPosition() {
  if (keysPressed.ArrowLeft && spaceshipX > 0) spaceshipX -= speed;
  if (keysPressed.ArrowRight && spaceshipX < window.innerWidth - 50) spaceshipX += speed;
  if (keysPressed.ArrowUp && spaceshipY > 0) spaceshipY -= speed;
  if (keysPressed.ArrowDown && spaceshipY < window.innerHeight - 50) spaceshipY += speed;

  spaceship.style.left = `${spaceshipX}px`;
  spaceship.style.top = `${spaceshipY}px`;
}

// Game Loop
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

// Initialize
createAsteroids();
applyLevelColors();
updateSpaceshipPosition();
gameLoop();

// Event Listeners for Key Press
document.addEventListener('keydown', (e) => {
  if (keysPressed[e.key] !== undefined) keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (keysPressed[e.key] !== undefined) keysPressed[e.key] = false;
});
