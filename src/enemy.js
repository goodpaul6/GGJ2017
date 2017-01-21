var enemies = [];

const ENEMY_TANGIBLE_TIME = 4;
const ENEMY_RADIUS = 20;
const ENEMY_INTANGIBLE_ALPHA = 0.4;

const ENEMY_TYPE_LASER = 0;
const ENEMY_TYPE_ROCKET  = 1;

const ENEMY_ROCKET_SHOOT_COOLDOWN = 2;
const ENEMY_ROCKET_SIGHT_RADIUS = 200;
const ENEMY_ROCKET_FOLLOW_RADIUS = 400;
const ENEMY_ROCKET_MOVE_SPEED = 200;

const ENEMY_STATE_NONE = 0;
const ENEMY_STATE_SEEN_PLAYER = 1;

function createEnemy(type, x, y) {
    enemies.push({
        type : type,
        freq : ECHO_RED_FREQ,
        x : x,
        y : y,
        tangibleTime : 0,
        shootTimer : 0,
        state : ENEMY_STATE_NONE,
        width : 32,
        height : 32,
        hit : false
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
            var dist2 = (echo.x - enemy.x) * (echo.x - enemy.x) + (echo.y - enemy.y) * (echo.y - enemy.y);

            if(enemy.tangibleTime <= 0) {
                if(dist2 < echo.radius * echo.radius) {
                    enemy.tangibleTime = ENEMY_TANGIBLE_TIME;
                }
            }
        }

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
                enemy.shootTimer -= dt;
                
                var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

                var canShoot = !collideLineLevel(enemy.x, enemy.y, player.x, player.y);

                if(dist2 < ENEMY_ROCKET_FOLLOW_RADIUS * ENEMY_ROCKET_FOLLOW_RADIUS) {
                    var angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                    
                    if(canShoot) {
                        if(enemy.shootTimer <= 0) {
                            enemy.shootTimer = ENEMY_ROCKET_SHOOT_COOLDOWN;
                            shootRocket(enemy.x, enemy.y, angle);
                        }
                    } else {
                        move(enemy, Math.cos(angle) * ENEMY_ROCKET_MOVE_SPEED * dt, Math.sin(angle) * ENEMY_ROCKET_MOVE_SPEED * dt);
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

        ctx.drawImage(enemyImage, enemy.x - camera.x, enemy.y - camera.y);

        ctx.globalAlpha = prevAlpha;
    }
}