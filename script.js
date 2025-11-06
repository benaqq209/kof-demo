const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player1 = { x: 50, y: 300, width: 50, height: 50, color: 'red', vx: 0, vy: 0, hp: 100, attackCooldown: 0 };
const player2 = { x: 700, y: 300, width: 50, height: 50, color: 'blue', vx: 0, vy: 0, hp: 100, attackCooldown: 0 };

const speed = 5;
const jumpHeight = 15;
const gravity = 0.7;
const attackPower = 10;
const attackDuration = 10;

const keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function updatePlayer(player, leftKey, rightKey, jumpKey, attackKey, opponent) {
    if (keys[leftKey]) player.vx = -speed;
    else if (keys[rightKey]) player.vx = speed;
    else player.vx = 0;
    player.x += player.vx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    if (keys[jumpKey] && player.y >= 300) player.vy = -jumpHeight;
    player.vy += gravity;
    player.y += player.vy;
    if (player.y >= 300) {
        player.y = 300;
        player.vy = 0;
    }

    if (player.attackCooldown > 0) player.attackCooldown--;

    if (keys[attackKey] && player.attackCooldown === 0) {
        player.attackCooldown = attackDuration;
        if (player.x < opponent.x + opponent.width &&
            player.x + player.width > opponent.x &&
            player.y < opponent.y + opponent.height &&
            player.y + player.height > opponent.y) {
            opponent.hp -= attackPower;
            if (opponent.hp < 0) opponent.hp = 0;
        }
    }
}

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y - 10, player.width * (player.hp / 100), 5);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(player.x, player.y - 10, player.width, 5);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer(player1, 'a', 'd', 'w', 's', player2);
    updatePlayer(player2, 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', player1);

    drawPlayer(player1);
    drawPlayer(player2);

    if (player1.hp === 0 || player2.hp === 0) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player1.hp === 0 ? 'Player 2 Kazandı!' : 'Player 1 Kazandı!', canvas.width/2, canvas.height/2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
