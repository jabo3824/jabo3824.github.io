// Selectors
const spaceship = document.getElementById('spaceship');
const gameContainer = document.getElementById('game-container');

// Initial Variables
let spaceshipX = window.innerWidth / 2;
let spaceshipY = window.innerHeight - 70;
let speed = 15; // Increased spaceship base speed
let acceleration = 1; // Faster acceleration
let maxSpeed = 30; // Higher cap for speed
let keysPressed = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

let health = 100;
let score = 0;
let frameCount = 0;

const largeAsteroidChance = 0.4; // 40% chance for a large asteroid
const treasureSpawnInterval = 150; // Reduced frames between treasure spawns
let treasures = [];

// Obstacles (Asteroids)
const asteroids = [];
const asteroidCount = 20;

// Create Asteroids
function createAsteroids() {
  for (let i = 0; i < asteroidCount; i++) {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');

    // Randomly decide if this is a large asteroid
    const isLarge = Math.random() < largeAsteroidChance;
    asteroid.classList.toggle('large-asteroid', isLarge);

    // Set random positions and speeds
    asteroid.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    asteroid.style.top = `${-Math.random() * 500}px`; // Start above the screen
    gameContainer.appendChild(asteroid);

    // Add asteroid to the array
    asteroids.push({
      element: asteroid,
      speed: isLarge ? 7 + Math.random() * 3 : 10 + Math.random() * 3, // Faster speeds
      size: isLarge ? 'large' : 'small',
    });
  }
}

// Create Treasures
function createTreasure() {
  const treasure = document.createElement('div');
  treasure.classList.add('treasure');
  treasure.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  treasure.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
  gameContainer.appendChild(treasure);

  treasures.push({
    element: treasure,
    timer: 200, // Frames before despawning
  });
}

// Update Treasures
function updateTreasures() {
  treasures.forEach((treasure, index) => {
    treasure.timer--;

    // Check if player collects treasure
    if (checkCollision(treasure.element, spaceship)) {
      score += 100; // Bonus points for collecting treasure
      updateScore();
      treasure.element.remove();
      treasures.splice(index, 1);
    }

    // Remove treasure if timer expires
    if (treasure.timer <= 0) {
      treasure.element.remove();
      treasures.splice(index, 1);
    }
  });
}

// Update Asteroids
function updateAsteroids() {
  asteroids.forEach((asteroid) => {
    const currentTop = parseFloat(asteroid.element.style.top);

    // Move asteroid downward
    if (currentTop > window.innerHeight) {
      // Reset asteroid position
      resetAsteroid(asteroid);
    } else {
      asteroid.element.style.top = `${currentTop + asteroid.speed}px`;
    }

    // Check for collisions
    if (checkCollision(asteroid.element, spaceship)) {
      health -= asteroid.size === 'large' ? 20 : 10; // Large asteroids deal more damage
      updateHealth();
      resetAsteroid(asteroid); // Reset asteroid after collision
    }
  });
}

// Reset Asteroid Position and Properties
function resetAsteroid(asteroid) {
  asteroid.element.style.top = `${-50}px`;
  asteroid.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  asteroid.speed = asteroid.size === 'large' ? 7 + Math.random() * 3 : 10 + Math.random() * 3;
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
    alert(`Game Over! Final Score: ${score}`);
    window.location.reload();
  }
}

// Update Score
function updateScore() {
  document.getElementById('score').textContent = score;
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

  // Spawn treasures more frequently
  if (frameCount % treasureSpawnInterval === 0) {
    createTreasure();
  }

  requestAnimationFrame(gameLoop);
}

// Initialize
createAsteroids();
updateSpaceshipPosition();
gameLoop();

// Event Listeners for Key Press
document.addEventListener('keydown', (e) => {
  if (keysPressed[e.key] !== undefined) keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (keysPressed[e.key] !== undefined) keysPressed[e.key] = false;
});
