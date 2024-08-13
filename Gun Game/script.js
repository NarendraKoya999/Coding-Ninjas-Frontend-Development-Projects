// Fetch the canvas element from the HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the gun object and its properties
let gun = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 80,
    dx: 20
};

// An array to store the bullets
let bullets = [];

// Define the target object and its properties
let target = {
    x: 100,
    y: 50,
    radius: 20,
    dx: 6
};

// Load the bullet sound effect and game over sound
let bulletSound = new Audio('bulletFire.mp3');
let gameOverSound = new Audio('gameOver.wav');

// Game variables
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let spacePressed = false;
let gameState = "notStarted";
let consecutiveMisses = 0;

// Load images
let monsterImg = new Image();
monsterImg.src = "monsterimage.png";

let bulletImg = new Image();
bulletImg.src = "bulletimage.png";

let gunImg = new Image();
gunImg.src = "gunimage.png";

// Function to start or restart the game
function startGame() {
    // Reset game variables
    score = 0;
    consecutiveMisses = 0;
    gun.x = canvas.width / 2 - 25;
    target.x = 100;
    target.y = 50;
    target.dx = 6;
    canvas.classList.remove("game-over");
    
    // Update scores
    updateScore();
    gameState = "ongoing";
}

// Function to update score display
function updateScore() {
    document.getElementById("currentScore").textContent = `Score: ${score}`;
    document.getElementById("highestScore").textContent = `High Score: ${highScore}`;
}

// Function to handle game over
// Function to handle game over
function gameOver() {
    gameState = "ended";
    canvas.classList.add("game-over");
    canvas.style.backgroundColor = 'red'; // Ensure the background color is set to red
    gameOverSound.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    updateScore();
}

// Function to start or restart the game
function startGame() {
    // Reset game variables
    score = 0;
    consecutiveMisses = 0;
    gun.x = canvas.width / 2 - 25;
    target.x = 100;
    target.y = 50;
    target.dx = 6;
    canvas.classList.remove("game-over");
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Reset background color
    updateScore();
    gameState = "ongoing";
}


// Function to move the gun
function moveGun(direction) {
    if (direction === 'left' && gun.x > 0) {
        gun.x -= gun.dx;
    }
    if (direction === 'right' && gun.x < canvas.width - gun.width) {
        gun.x += gun.dx;
    }
}

// Function to fire bullets
function fireBullet() {
    if (gameState === "ongoing") {
        bullets.push({
            x: gun.x + gun.width / 2,
            y: gun.y,
            width: 10,
            height: 20,
            dy: -5
        });
        bulletSound.play();
    }
}

// Function to update the target position
function updateTarget() {
    target.x += target.dx;
    if (target.x + target.radius > canvas.width || target.x - target.radius < 0) {
        target.dx *= -1;
    }
}

// Function to handle bullet collisions
function checkCollisions() {
    bullets.forEach((bullet, index) => {
        if (bullet.y < target.y + target.radius &&
            bullet.y + bullet.height > target.y - target.radius &&
            bullet.x > target.x - target.radius &&
            bullet.x < target.x + target.radius) {
            // Hit
            score += 5;
            consecutiveMisses = 0;
            bullets.splice(index, 1); // Remove bullet
            updateTarget(); // Reposition the target
            updateScore();
        } else if (bullet.y < 0) {
            // Missed bullet
            bullets.splice(index, 1); // Remove bullet
            consecutiveMisses++;
            score -= 2;
            updateScore();
            if (consecutiveMisses >= 3) {
                gameOver();
            }
        }
    });
}

// Function to draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "ongoing") {
        // Draw gun
        ctx.drawImage(gunImg, gun.x, gun.y, gun.width, gun.height);

        // Draw bullets
        bullets.forEach(bullet => {
            ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
            bullet.y += bullet.dy;
        });

        // Draw target
        ctx.drawImage(monsterImg, target.x - target.radius, target.y - target.radius, target.radius * 2, target.radius * 2);

        // Update target position
        updateTarget();

        // Check for collisions
        checkCollisions();
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        moveGun('left');
    } else if (e.code === 'ArrowRight') {
        moveGun('right');
    } else if (e.code === 'Space') {
        fireBullet();
    } else if (e.code === 'Enter' && gameState === "notStarted") {
        startGame();
    }
});

document.getElementById('startGameBtn').addEventListener('click', startGame);

// Game loop
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
