var groundReady = false;
var ground = new Image();

ground.onload = function() {
    groundReady = true;
}

ground.src = "graphics/ground.png";

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