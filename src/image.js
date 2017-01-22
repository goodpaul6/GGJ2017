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

const PLAYER_FRAME_WIDTH = 48;
const PLAYER_FRAME_HEIGHT = 60;

const PLAYER_ANIM_RUN = [0,1,2,3,4,5,6,7];
const PLAYER_ANIM_STAND = [8];
const PLAYER_ANIM_JUMP = [9];