var enemies = [];

const ENEMY_VISIBLE_TIME = 1;
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

        if(enemy.echoTime <= 0) {
            if(dist2 < echo.radius * echo.radius) {
                enemy.echoTime = ENEMY_VISIBLE_TIME;
            }
        }
        enemy.echoTime -= dt;
    }   
}

function drawEnemies() {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(enemy.echoTime > 0) {
            var prevAlpha = ctx.globalAlpha;

            ctx.globalAlpha = enemy.echoTime / ENEMY_VISIBLE_TIME;
            ctx.drawImage(enemyImage, enemy.x - camera.x, enemy.y - camera.y);

            ctx.globalAlpha = prevAlpha;
        }
    }
}