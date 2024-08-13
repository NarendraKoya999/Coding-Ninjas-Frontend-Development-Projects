// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 100,
    y: 300,
    width: 30,
    height: 50,
    jumping: false,
    velocityY: 0,
    speed: 3
};

const gravity = 1;
const jumpForce = -10;
const maxJumpTime = 500;

const platforms = [
    { x: 0, y: 350, width: canvas.width, height: 50 },
    { x: 200, y: 280, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 600, y: 150, width: 100, height: 20 },
    { x: 700, y: 100, width: 100, height: 20 }
];

const spikes = [
    { x: 350, y: 320, width: 50, height: 30 },
    { x: 500, y: 170, width: 50, height: 30 }
];

const doubleJumpPowerup = {
    x: 450,
    y: 100,
    width: 30,
    height: 30
};

const enemy = {
    x: 650,
    y: 320,
    width: 30,
    height: 30,
    speed: 2,
    direction: -1
};

let gameRunning = false;
let score = 0;
let hasDoubleJump = false;
let doubleJumpUsed = false;

document.getElementById("startButton").addEventListener('click', () => {
    gameRunning = true;
    gameLoop();
});

document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
        player.x -= player.speed;
    } else if (event.code === "ArrowRight") {
        player.x += player.speed;
    } else if (event.code === "Space" && (!player.jumping || (hasDoubleJump && !doubleJumpUsed))) {
        player.jumping = true;
        player.velocityY = jumpForce;
        if (hasDoubleJump && !doubleJumpUsed) {
            doubleJumpUsed = true;
        }
    }
});

document.addEventListener("keyup", function(event) {
    if (event.code === "Space") {
        player.jumping = false;
    }
});

function isColliding(objA, objB) {
    return (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y < objB.y + objB.height &&
        objA.y + objA.height > objB.y
    );
}

function endGame() {
    gameRunning = false;
    alert("Game Over! Your score: " + score);
    window.location.reload();
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = "green";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw spikes
    ctx.fillStyle = "red";
    spikes.forEach(spike => {
        ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
    });

    // Draw double jump power-up
    ctx.fillStyle = "orange";
    ctx.fillRect(doubleJumpPowerup.x, doubleJumpPowerup.y, doubleJumpPowerup.width, doubleJumpPowerup.height);

    // Draw enemy
    ctx.fillStyle = "black";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Update enemy position
    enemy.x += enemy.speed * enemy.direction;
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.direction *= -1;
    }

    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Check for platform collision
    platforms.forEach(platform => {
        if (isColliding(player, platform) && player.velocityY >= 0) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
            doubleJumpUsed = false; // Reset double jump when landing
        }
    });

    // Check for spike collision
    spikes.forEach(spike => {
        if (isColliding(player, spike)) {
            endGame();
        }
    });

    // Check for double jump power-up
    if (isColliding(player, doubleJumpPowerup)) {
        hasDoubleJump = true;
        doubleJumpPowerup.x = -100; // Move the power-up off-screen
    }

    // Check for enemy collision
    if (isColliding(player, enemy)) {
        endGame();
    }

    // Check if player falls off the screen
    if (player.y > canvas.height) {
        endGame();
    }

    // Score update
    score += 1;
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(gameLoop);
}

window.isPlayerJumping = function() {
    return player.jumping;
};
window.score = score;
window.player = player;
window.gameLoop = gameLoop;
window.gameRunning = gameRunning;
window.spikes = spikes;
window.enemy = enemy;
