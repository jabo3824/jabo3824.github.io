
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


let spaceshipX = window.innerWidth / 2;
let spaceshipY = window.innerHeight - 70;
let speed = 8;
let acceleration = 0.7;
let keysPressed = { W: false, A: false, S: false, D: false };

let health = 100;
let score = 0;
let frameCount = 0;

let currentLevel = 1;
const largeAsteroidChance = 0.3;
let treasureSpawnInterval = 100;

const asteroids = [];
const asteroidCount = 35;
let treasures = [];


const baseAsteroidSpeed = {
  small: 3,
  large: 4,
};


const dynamicAsteroidSpeedAdjustment = {
  forward: 2,
  backward: -2,
};


const levelColors = {
  1: { background: '#000020', smallAsteroid: '#ff5733', largeAsteroid: '#c70039' },
  2: { background: '#001a33', smallAsteroid: '#33ff57', largeAsteroid: '#39c700' },
  3: { background: '#33001a', smallAsteroid: '#5733ff', largeAsteroid: '#0039c7' },
};

function showStartScreen() {
  startScreen.style.display = 'flex';
  startButton.textContent = 'Restart Game';
}


function showBanner(message) {
  banner.textContent = message;
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 2000);
}

function createAsteroids() {
  for (let i = 0; i < asteroidCount; i++) {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');

    const isLarge = Math.random() < largeAsteroidChance;
    if (isLarge) asteroid.classList.add('large-asteroid');

    
    asteroid.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    asteroid.style.top = `${-Math.random() * 500}px`;

    
    asteroid.classList.add('level-1');

    gameContainer.appendChild(asteroid);

    asteroids.push({
      element: asteroid,
      speed: isLarge ? baseAsteroidSpeed.large : baseAsteroidSpeed.small,
      size: isLarge ? 'large' : 'small',
    });
  }
}


function increaseDifficulty() {
  currentLevel++;
  treasureSpawnInterval = Math.max(treasureSpawnInterval - 20, 50); 

  health = 100;
  updateHealth();

  
  asteroids.forEach((asteroid) => {
    asteroid.speed += 1;
  });

  applyLevelColors(); 
  showBanner(`Welcome to Level ${currentLevel}!`);
}


function applyLevelColors() {
  const colors = levelColors[currentLevel % Object.keys(levelColors).length + 1] || levelColors[1];
  if (colors) {
    
    gameContainer.style.backgroundColor = colors.background;

    
    asteroids.forEach((asteroid) => {
      asteroid.element.style.backgroundColor =
        asteroid.size === 'large' ? colors.largeAsteroid : colors.smallAsteroid;
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
      respawnAsteroid(asteroid); 
    } else {
      asteroid.element.style.top = `${currentTop + adjustedSpeed}px`;
    }

    if (checkCollision(asteroid.element, spaceship)) {
      health -= asteroid.size === 'large' ? 20 : 10;
      updateHealth();
      respawnAsteroid(asteroid);
    }
  });
}



function getPlayerDirection() {
  if (keysPressed.W) return 'forward'; 
  if (keysPressed.S) return 'backward'; 
  return 'idle'; 
}


function respawnAsteroid(asteroid) {
  asteroid.element.style.top = `${-Math.random() * 500}px`; 
  asteroid.element.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  asteroid.speed = asteroid.size === 'large' ? baseAsteroidSpeed.large : baseAsteroidSpeed.small;

  const colors = levelColors[currentLevel % Object.keys(levelColors).length + 1] || levelColors[1];
  asteroid.element.style.backgroundColor =
    asteroid.size === 'large' ? colors.largeAsteroid : colors.smallAsteroid;
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
  const healthElement = document.getElementById('health');
  healthElement.textContent = health;

  if (health <= 30) {
    healthElement.style.color = 'red'; 
  } else {
    healthElement.style.color = 'white'; 
  }

  if (health <= 0) {
    showBanner(`Game Over! Final Score: ${score}`);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}



function updateScore() {
  document.getElementById('score').textContent = score;

  
  if (score >= 500 * currentLevel) {
    increaseDifficulty();
  }
}


function updateSpaceshipPosition() {
  let moving = false;

  if (keysPressed.W && keysPressed.A) {
    spaceshipY -= speed;
    spaceshipX -= speed;
    spaceshipAngle = -45;
    moving = true;
  } else if (keysPressed.W && keysPressed.D) {
    spaceshipY -= speed;
    spaceshipX += speed;
    spaceshipAngle = 45;
    moving = true;
  } else if (keysPressed.S && keysPressed.A) {
    spaceshipY += speed;
    spaceshipX -= speed;
    spaceshipAngle = -135;
    moving = true;
  } else if (keysPressed.S && keysPressed.D) {
    spaceshipY += speed;
    spaceshipX += speed;
    spaceshipAngle = 135;
    moving = true;
  } else if (keysPressed.W) {
    spaceshipY -= speed;
    spaceshipAngle = 0;
    moving = true;
  } else if (keysPressed.S) {
    spaceshipY += speed;
    spaceshipAngle = 180;
    moving = true;
  } else if (keysPressed.A) {
    spaceshipX -= speed;
    spaceshipAngle = -90;
    moving = true;
  } else if (keysPressed.D) {
    spaceshipX += speed;
    spaceshipAngle = 90;
    moving = true;
  }

  
  if (!moving) {
    spaceshipAngle = 0; 
  }

  const screenWidth = window.innerWidth;

  
  if (spaceshipX < 0) spaceshipX = screenWidth - 50;
  if (spaceshipX > screenWidth - 50) spaceshipX = 0;

  
  if (spaceshipY < 0) spaceshipY = 0;
  if (spaceshipY > window.innerHeight - 50) spaceshipY = window.innerHeight - 50;

  
  spaceship.style.transform = `rotate(${spaceshipAngle}deg)`;
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


const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none'; 
  startGame(); 
});


document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase(); 
  if (keysPressed[key] !== undefined) keysPressed[key] = true;
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toUpperCase(); 
  if (keysPressed[key] !== undefined) keysPressed[key] = false;
});

let spaceshipAngle = 0; 



function startGame() {
  createAsteroids();
  applyLevelColors();
  updateSpaceshipPosition();
  gameLoop();
}