var enemies = [];

const ENEMY_TANGIBLE_TIME = 4;
const ENEMY_RADIUS = 20;
const ENEMY_INTANGIBLE_ALPHA = 0.4;

const ENEMY_TYPE_LASER = 0;
const ENEMY_TYPE_ROCKET  = 1;

const ENEMY_MOVE_BACK_DISTANCE = 300;

const ENEMY_ROCKET_SHOOT_COOLDOWN = 1;
const ENEMY_ROCKET_SIGHT_RADIUS = 400;
const ENEMY_ROCKET_CHASE_RADIUS = 300;
const ENEMY_ROCKET_FOLLOW_RADIUS = 800;
const ENEMY_ROCKET_ACCEL_SPEED = 4;

const ENEMY_STATE_NONE = 0;
const ENEMY_STATE_SEEN_PLAYER = 1;

const ENEMY_START_HEALTH = 3;
const ENEMY_HOVER_AMPLITUDE = 2;
const ENEMY_HOVER_PERIOD_FACTOR = 10;

const ENEMY_COLLISION_RADIUS = 64;
const ENEMY_PUSH_FORCE = 10;

const ENEMY_RANDOM_DROP_CHANCE = 0.5;

const ENEMY_SPRITE_OFF_X = 41;
const ENEMY_SPRITE_OFF_Y = 18;

const ENEMY_WIDTH = 58;
const ENEMY_HEIGHT = 87;

function createEnemy(type, x, y, color) {
    enemies.push({
        type : type,
        x : x,
        y : y,
        dx : 0,
        dy : 0,
        tangibleTime : 0,
        shootTimer : 0,
        state : ENEMY_STATE_SEEN_PLAYER,
        width : ENEMY_WIDTH,
        height : ENEMY_HEIGHT,
        hit : false,
        dir : 1,
        frameIndex : 0,
        frames : ENEMY_ANIM_IDLE,
        loop : true,
        animTimer : 0,
        frameTime : 0,
        health : ENEMY_START_HEALTH,
        hoverTimer : 0,
        color : color
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

        enemy.hoverTimer += dt;
    
        if(enemy.x < player.x) {
            enemy.dir = 1;
        } else {
            enemy.dir = -1;
        }
        
        enemy.shootTimer -= dt;

        if(enemy.type == ENEMY_TYPE_ROCKET) {
            enemy.dx *= 0.97;
            enemy.dy *= 0.97;
            
            if(enemy.state == ENEMY_STATE_SEEN_PLAYER) {
                var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

                var canShoot = !collideLineLevel(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, player.x, player.y);

                if(dist2 < ENEMY_ROCKET_FOLLOW_RADIUS * ENEMY_ROCKET_FOLLOW_RADIUS) {
                    var angle = Math.atan2(player.y - (enemy.y + enemy.height / 2), player.x - (enemy.x + enemy.width / 2));
                    
                    if(canShoot && dist2 < ENEMY_ROCKET_CHASE_RADIUS * ENEMY_ROCKET_CHASE_RADIUS) {
                        if(enemy.shootTimer <= 0) {
                            enemy.shootTimer = ENEMY_ROCKET_SHOOT_COOLDOWN;
                            shootRocket(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, angle);
                        }

                        if(enemy.anim != ENEMY_ANIM_STOP) {
                            enemy.animTimer = 0;
                        }

                        enemy.frameTime = 1;
                        enemy.frames = ENEMY_ANIM_STOP;
                        enemy.loop = false;
                    } else {
                        // TODO: Randomize direction
                        var dx = 0;
                        var dy = 0;

                        if(player.x + player.width / 2 < enemy.x + enemy.width / 2) {
                            dx = -ENEMY_ROCKET_ACCEL_SPEED * dt;
                        } else {
                            dx = ENEMY_ROCKET_ACCEL_SPEED * dt;
                        }

                        var py = player.y + player.height / 2;
                        var ey = enemy.y + enemy.height / 2; 

                        if(py < ey) {
                            dy = -ENEMY_ROCKET_ACCEL_SPEED * dt;
                        } else {
                            dy = ENEMY_ROCKET_ACCEL_SPEED * dt;
                        }
                        
                        enemy.loop = false;
                        if(enemy.frames != ENEMY_ANIM_MOVE) {
                            enemy.animTimer = 0;
                        }

                        enemy.frames = ENEMY_ANIM_MOVE;
                        enemy.frameTime = 1 / 3;

                        enemy.dx += dx;
                        enemy.dy += dy;
                    }
                }
            }

            for(var j = i + 1; j < enemies.length; ++j) {
                var otherEnemy = enemies[j];

                var dist2 = distanceSqr(enemy.x, enemy.y, otherEnemy.x, otherEnemy.y);

                if(dist2 < ENEMY_COLLISION_RADIUS * ENEMY_COLLISION_RADIUS) {
                    var angle = Math.atan2(otherEnemy.y - enemy.y, otherEnemy.x - enemy.x);

                    enemy.dx -= Math.cos(angle) * (ENEMY_PUSH_FORCE / 2);
                    enemy.dy -= Math.sin(angle) * (ENEMY_PUSH_FORCE / 2);
                    
                    otherEnemy.dx += Math.cos(angle) * (ENEMY_PUSH_FORCE / 2);
                    otherEnemy.dy += Math.sin(angle) * (ENEMY_PUSH_FORCE / 2);
                }
            }
            
            /*if(echo.active && goodEcho()) {
                var dist2 = distanceSqr(echo.x, echo.y, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                
                if(dist2 < ENEMY_COLLISION_RADIUS * ENEMY_COLLISION_RADIUS + echo.radius * echo.radius) {
                    var angle = Math.atan2(echo.y - enemy.y, echo.x - enemy.x);
                    var overlap = Math.sqrt(dist2) - ENEMY_COLLISION_RADIUS - echo.radius;

                    enemy.dx += Math.cos(angle) * overlap;
                    enemy.dy += Math.sin(angle) * overlap;
                }
            }*/

            move(enemy, enemy.dx, enemy.dy, function() {
                enemy.dx = 0;
            }, function() {
                enemy.dy = 0;
            });
        }

        if(enemy.hit) {
            enemy.health -= 1;
            if(enemy.health <= 0) {
                if(Math.random() <= ENEMY_RANDOM_DROP_CHANCE) {
                    var type = Math.ceil(Math.random() * POWERUP_COUNT) - 1;
                    spawnPowerup(enemy.x, enemy.y, type);
                }

                addExplosion(enemy.x, enemy.y);
                enemies.splice(i, 1);
            }
            enemy.hit = false;
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

            var px = enemy.x - camera.x - ENEMY_SPRITE_OFF_X;
            var py = enemy.y - camera.y - ENEMY_SPRITE_OFF_Y + Math.sin(enemy.hoverTimer * ENEMY_HOVER_PERIOD_FACTOR) * ENEMY_HOVER_AMPLITUDE;

            if(enemy.frames) {
                if(enemy.color == WAVE_SHOT_RED) { 
                    drawFrame(redEnemyImage, px, py, enemy.frames[enemy.frameIndex], ENEMY_FRAME_WIDTH, ENEMY_FRAME_HEIGHT, enemy.dir < 0);
                } else if(enemy.color == WAVE_SHOT_BLUE) {
                    drawFrame(enemyImage, px, py, enemy.frames[enemy.frameIndex], ENEMY_FRAME_WIDTH, ENEMY_FRAME_HEIGHT, enemy.dir < 0);
                } else if(enemy.color == WAVE_SHOT_YELLOW) {
                    drawFrame(yellowEnemyImage, px, py, enemy.frames[enemy.frameIndex], ENEMY_FRAME_WIDTH, ENEMY_FRAME_HEIGHT, enemy.dir < 0);
                }
            }
        }
    }
}