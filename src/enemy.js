var enemies = [];

const ENEMY_TANGIBLE_TIME = 4;
const ENEMY_RADIUS = 20;
const ENEMY_INTANGIBLE_ALPHA = 0.4;

const ENEMY_TYPE_LASER = 0;
const ENEMY_TYPE_ROCKET  = 1;

const ENEMY_ROCKET_SHOOT_COOLDOWN = 2;
const ENEMY_ROCKET_SIGHT_RADIUS = 400;
const ENEMY_ROCKET_FOLLOW_RADIUS = 800;
const ENEMY_ROCKET_MOVE_SPEED = 200;

const ENEMY_STATE_NONE = 0;
const ENEMY_STATE_SEEN_PLAYER = 1;
const ENEMY_MOVE_SPEED = 200;

function createEnemy(type, x, y) {
    enemies.push({
        type : type,
        freq : ECHO_RED_FREQ,
        x : x,
        y : y,
        tangibleTime : 0,
        shootTimer : 0,
        state : ENEMY_STATE_NONE,
        width : 128,
        height : 128,
        hit : false,
        dir : 1
    });
}

function collideEnemy(x, y, w, h, callback) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(enemy.tangibleTime > 0) {
            if(x + w < enemy.x || enemy.x + enemy.width < x) continue;
            if(y + h < enemy.y || enemy.y + enemy.height < y) continue;   

            callback(enemy);
            break;
        }
    }
}

function updateEnemies(dt) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(echo.active && echo.freq == ECHO_NORMAL_FREQ) {
            var cx = enemy.x + enemy.width / 2;
            var cy = enemy.y + enemy.height / 2;

            var dist2 = distanceSqr(cx, cy, echo.x, echo.y);

            if(enemy.tangibleTime <= 0) {
                if(dist2 < echo.radius * echo.radius) {
                    enemy.tangibleTime = ENEMY_TANGIBLE_TIME;
                }
            }
        }
    
        if(enemy.x < player.x) {
            enemy.dir = 1;
        } else {
            enemy.dir = -1;
        }
        
        enemy.shootTimer -= dt;

        if(enemy.type == ENEMY_TYPE_ROCKET) {
            if(enemy.state == ENEMY_STATE_NONE) {
                var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

                if(dist2 < ENEMY_ROCKET_SIGHT_RADIUS * ENEMY_ROCKET_SIGHT_RADIUS) {
                    if(!collideLineLevel(enemy.x, enemy.y, player.x, player.y)) {
                        // I CAN SEE THE PLAYER
                        enemy.state = ENEMY_STATE_SEEN_PLAYER;        
                    }
                }
            } else if(enemy.state == ENEMY_STATE_SEEN_PLAYER) {
                var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

                var canShoot = !collideLineLevel(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, player.x, player.y);

                if(dist2 < ENEMY_ROCKET_FOLLOW_RADIUS * ENEMY_ROCKET_FOLLOW_RADIUS) {
                    var angle = Math.atan2(player.y - (enemy.y + enemy.height / 2), player.x - (enemy.x + enemy.width / 2));
                    
                    if(canShoot) {
                        if(enemy.shootTimer <= 0) {
                            enemy.shootTimer = ENEMY_ROCKET_SHOOT_COOLDOWN;
                            shootRocket(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, angle);
                        }
                    } else {
                        // TODO: Randomize direction
                        var dx = ENEMY_MOVE_SPEED * dt;
                        var dy = 0;

                        if(player.y + player.height / 2 < enemy.y + enemy.height / 2) {
                            dy = -ENEMY_MOVE_SPEED * dt;
                        } else {
                            dy = ENEMY_MOVE_SPEED * dt;
                        }

                        move(enemy, dx, dy);
                    }
                } else {
                    enemy.state = ENEMY_STATE_NONE;
                }
            }
        }

        if(enemy.hit) {
            enemies.splice(i, 1);
        }
    
        enemy.tangibleTime -= dt;
    }   
}

function drawEnemies() {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        var prevAlpha = ctx.globalAlpha;

        if(enemy.tangibleTime > 0) {
            ctx.globalAlpha = 1;    
        } else {
            ctx.globalAlpha = ENEMY_INTANGIBLE_ALPHA;
        }

        drawFrame(enemyImage, enemy.x - camera.x, enemy.y - camera.y, 0, enemyImage.width, enemyImage.height, enemy.dir < 0);

        ctx.globalAlpha = prevAlpha;

        var cx = enemy.x - camera.x + enemy.width / 2;
        var cy = enemy.y - camera.y + enemy.height / 2;
    }
}