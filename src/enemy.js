var enemies = [];

const ENEMY_VISIBLE_TIME = 2;
const ENEMY_RADIUS = 20;

function createEnemy(x, y) {
    enemies.push({
        x : x,
        y : y,
        echoTime : 0
    });
}

function updateEnemies(dt) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        var dist2 = (echo.x - enemy.x) * (echo.x - enemy.x) + (echo.y - enemy.y) * (echo.y - enemy.y);

        if(dist2 < echo.radius * echo.radius) {
            enemy.echoTime = ENEMY_VISIBLE_TIME;
        }
        enemy.echoTime -= dt;
    }   
}

function drawEnemies() {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(enemy.echoTime > 0) {
            ctx.beginPath();
            ctx.arc(enemy.x - camera.x, enemy.y - camera.y, ENEMY_RADIUS, 0, Math.PI * 2);
            ctx.closePath();

            var prevAlpha = ctx.globalAlpha;

            ctx.globalAlpha = enemy.echoTime / ENEMY_VISIBLE_TIME;

            ctx.strokeStyle = "red";
            ctx.stroke();

            ctx.globalAlpha = prevAlpha;
        }
    }
}