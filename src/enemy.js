var enemies = [];

const ENEMY_TANGIBLE_TIME = 4;
const ENEMY_RADIUS = 20;
const ENEMY_INTANGIBLE_ALPHA = 0.4;

const ENEMY_TYPE_LASER = 0;
const ENEMY_TYPE_ROCKET  = 1;

const ENEMY_ROCKET_SHOOT_COOLDOWN = 2;
const ENEMY_ROCKET_SIGHT_RADIUS = 200;
const ENEMY_ROCKET_FOLLOW_RADIUS = 800;
const ENEMY_ROCKET_ACCEL_SPEED = 4;

const ENEMY_STATE_NONE = 0;
const ENEMY_STATE_SEEN_PLAYER = 1;

function createEnemy(type, x, y) {
    enemies.push({
        type : type,
        x : x,
        y : y,
        dx : 0,
        dy : 0,
        tangibleTime : 0,
        shootTimer : 0,
        state : ENEMY_STATE_NONE,
        width : ENEMY_FRAME_WIDTH,
        height : ENEMY_FRAME_HEIGHT,
        hit : false,
        dir : 1,
        frameIndex : 0,
        frames : ENEMY_ANIM_IDLE,
        loop : true,
        animTimer : 0,
        frameTime : 0
    });
}

function collideEnemy(x, y, w, h, callback) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(x + w < enemy.x || enemy.x + enemy.width < x) continue;
        if(y + h < enemy.y || enemy.y + enemy.height < y) continue;   

        callback(enemy);
        break;
    }
}

function updateEnemies(dt) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(echo.active) {
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
            enemy.dx *= 0.99;
            enemy.dy *= 0.99;
                        
            if(enemy.state == ENEMY_STATE_NONE) {
                var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

                if(dist2 < ENEMY_ROCKET_SIGHT_RADIUS * ENEMY_ROCKET_SIGHT_RADIUS) {
                    if(!collideLineLevel(enemy.x, enemy.y, player.x, player.y)) {
                        // I CAN SEE THE PLAYER
                        enemy.state = ENEMY_STATE_SEEN_PLAYER;        
                    }
                }

                enemy.frames = ENEMY_ANIM_IDLE;
            } else if(enemy.state == ENEMY_STATE_SEEN_PLAYER) {
                var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

                var canShoot = !collideLineLevel(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, player.x, player.y);

                if(dist2 < ENEMY_ROCKET_FOLLOW_RADIUS * ENEMY_ROCKET_FOLLOW_RADIUS) {
                    var angle = Math.atan2(player.y - (enemy.y + enemy.height / 2), player.x - (enemy.x + enemy.width / 2));
                    
                    if(canShoot && dist2 < ENEMY_ROCKET_SIGHT_RADIUS * ENEMY_ROCKET_SIGHT_RADIUS) {
                        if(enemy.shootTimer <= 0) {
                            enemy.shootTimer = ENEMY_ROCKET_SHOOT_COOLDOWN;
                            shootRocket(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, angle);
                        }

                        enemy.frameTime = 1;
                        enemy.frames = ENEMY_ANIM_STOP;
                        enemy.loop = false;
                    } else {
                        // TODO: Randomize direction
                        var dx = 0;
                        var dy = 0;

                        if(player.x + player.width / 2 < enemy.x) {
                            dx = -ENEMY_ROCKET_ACCEL_SPEED * dt;
                        } else {
                            dx = ENEMY_ROCKET_ACCEL_SPEED * dt;
                        }

                        if(player.y + player.height / 2 < enemy.y + enemy.height / 2) {
                            dy = -ENEMY_ROCKET_ACCEL_SPEED * dt;
                        } else {
                            dy = ENEMY_ROCKET_ACCEL_SPEED * dt;
                        }

                        if(collideLevel(enemy.x, enemy.y + enemy.dy, enemy.width, enemy.height)) {
                            dx = -enemy.dir * ENEMY_ROCKET_ACCEL_SPEED * dt;
                        }

                        enemy.loop = false;
                        enemy.frames = ENEMY_ANIM_MOVE;
                        enemy.frameTime = 1 / 2;

                        enemy.dx += dx;
                        enemy.dy += dy;
                    }
                } else {
                    enemy.state = ENEMY_STATE_NONE;
                }
            }

            move(enemy, enemy.dx, enemy.dy, function() {
                enemy.dx = 0;
            }, function() {
                enemy.dy = 0;
            });
        }

        if(enemy.hit) {
            addExplosion(enemy.x, enemy.y);
            enemies.splice(i, 1);
        }
        
        if(enemy.frames) {
            enemy.frameIndex = Math.floor(enemy.animTimer / enemy.frameTime);
            if(enemy.frameIndex >= enemy.frames.length) {
                if(enemy.loop) {
                    enemy.frameIndex = 0;
                    enemy.animTimer = 0;
                } else {
                    enemy.frameIndex = enemy.frames.length - 1;
                }
            }

            enemy.animTimer += dt;
        }
    }   
}

function drawEnemies() {
    if(enemyReady) {
        for(var i = 0; i < enemies.length; ++i) {
            var enemy = enemies[i];
            
            ctx.globalAlpha = 1;

            if(enemy.frames) {
                drawFrame(enemyImage, enemy.x - camera.x, enemy.y - camera.y, enemy.frames[enemy.frameIndex], ENEMY_FRAME_WIDTH, ENEMY_FRAME_HEIGHT, enemy.dir < 0);
            }
        }
    }
}