var groundReady = false;
var ground = new Image();

ground.onload = function() {
    groundReady = true;
}

ground.src = "graphics/ground.png";

var enemyReady = false;
var enemyImage = new Image();

enemyImage.onload = function() {
    enemyReady = true;
}

enemyImage.src = "graphics/monster1.png";

const ENEMY_FRAME_WIDTH = 128;
const ENEMY_FRAME_HEIGHT = 128;

const ENEMY_ANIM_IDLE = [5];
const ENEMY_ANIM_MOVE = [0,1,2];
const ENEMY_ANIM_STOP = [3,4];

var explosionReady = false;
var explosionImage = new Image();

explosionImage.onload = function() {
    explosionReady = true;
}

explosionImage.src = "graphics/explosion.png";

const EXPLOSION_FRAME_TIME = 1 / 30;
const EXPLOSION_FRAME_WIDTH = 120;
const EXPLOSION_FRAME_HEIGHT = 94;

var heartReady = false;
var heartImage = new Image();

heartReady = false;
heartImage.onload = function() {
    heartReady = true;
}

heartImage.src = "graphics/heart.png";

var rocketReady = false;
var rocketImage = new Image();

rocketImage.onload = function() {
    rocketReady = true;
}

rocketImage.src = "graphics/rocket.png";

var playerReady = false;
var playerImage = new Image();

playerImage.onload = function() {
    playerReady = true;
}

playerImage.src = "graphics/player.png";

const PLAYER_FRAME_WIDTH = 128;
const PLAYER_FRAME_HEIGHT = 128;

const PLAYER_STAND_FRAME_TIME = 0.1;
const PLAYER_RUN_FRAME_TIME = 0.05;
const PLAYER_JUMP_FRAME_TIME = 0.2;

const PLAYER_ANIM_RUN = [6,7,8,9,10,11,12,13];
const PLAYER_ANIM_STAND = [0];
const PLAYER_ANIM_JUMP = [3,4,5];

var redWaveReady = false;
var redWaveImage = new Image();

redWaveImage.onload = function() {
    redWaveReady = true;
}

redWaveImage.src = "graphics/redwave.png";

var blueWaveReady = false;
var blueWaveImage = new Image();

blueWaveImage.onload = function() {
    blueWaveReady = true;
}

blueWaveImage.src = "graphics/bluewave.png";

var yellowWaveReady = false;
var yellowWaveImage = new Image();

yellowWaveImage.onload = function() {
    yellowWaveReady = true;
}

yellowWaveImage.src = "graphics/yellowwave.png";

var starReady = false;
var starImage = new Image();

starImage.onload = function() {
    starReady = false;
}

starImage.src = "graphics/star.png";

var doorReady = false;
var doorImage = new Image();

doorImage.onload = function() {
    doorReady = true;
}

doorImage.src = "graphics/door.png";

var redEnemyReady = false;
var redEnemyImage = new Image();

redEnemyImage.onload = function() {
    redEnemyReady = true;
}

redEnemyImage.src = "graphics/redenemy.png";

var yellowEnemyReady = false;
var yellowEnemyImage = new Image();

yellowEnemyImage.onload = function() {
    yellowEnemyReady = true;
}

yellowEnemyImage.src = "graphics/yellowenemy.png";

var ammoReady = false;
var ammoImage = new Image();

ammoImage.onload = function() {
    ammoReady = true;
}

ammoImage.src = "graphics/ammo.png";