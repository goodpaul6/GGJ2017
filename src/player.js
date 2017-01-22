"use strict";

const PLAYER_START_AMMO = 30;
const PLAYER_SHOT_TIME = 1;
const PLAYER_START_HEALTH = 5;
const PLAYER_JET_ACCEL = 25;
const PLAYER_TERMINAL_VEL = 700;
const PLAYER_JET_FUEL = 120;
const PLAYER_FUEL_REGEN_RATE = 20;
const PLAYER_FUEL_USE_RATE = 30; 

const PLAYER_SPRITE_OFF_X = 40;
const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 125;

const PLAYER_GUN_OFF_X = 60;
const PLAYER_GUN_OFF_Y = 45;

var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : PLAYER_WIDTH,
	height : PLAYER_HEIGHT,
	grounded : false,
	frameIndex : 0,
	anim : PLAYER_ANIM_STAND,
	animTimer : 0,
	animFrameTime : 1 / 12,
	flipped : false,
    jumped : false,
	shotTime: 0,
	ammo : PLAYER_START_AMMO,
	health: PLAYER_START_HEALTH,
<<<<<<< HEAD
	loop : false
=======
	jetFuel : PLAYER_JET_FUEL,
>>>>>>> fd2b3f4ecb36d1024128e869c17b0fe45bac33e7
};

function move(ent, x, y, collideX, collideY) {
	const SAMPLES = 5;

	var moveX = x / SAMPLES;
	var moveY = y / SAMPLES;

	for(var i = 0; i < SAMPLES; ++i) {
		if(!collideLevel(ent.x + moveX, ent.y, ent.width, ent.height)) {
			ent.x += moveX; 
		} else {
			if(collideX) {
				collideX();
			}
			break;
		}
	}
	
	for(var i = 0; i < SAMPLES; ++i) {
		if(!collideLevel(ent.x, ent.y + moveY, ent.width, ent.height)) {
			ent.y += moveY;
		} else {
			if(collideY) {
				collideY();
			}
			break;
		}
	}
}

function updatePlayer(dt) {
	if(collideLevel(player.x, player.y + 1, player.width, player.height)) {
		player.grounded = true;
        player.jumped = false;
		player.dy = 0;
	} else {
		player.grounded = false;
		player.dy += 16 * dt;
	}
	
	var doEcho = 32 in keysJustPressed;
	var left = (37 in keysDown) || (65 in keysDown);
	var right = (39 in keysDown) || (68 in keysDown);
	var jump = (38 in keysJustPressed) || (87 in keysJustPressed);
	var up = (38 in keysDown) || (87 in keysDown);
    var down = (40 in keysDown) || (83 in keysDown);
	var shootRed = (90 in keysDown) || (74 in keysDown);
	var shootBlue = (88 in keysDown) || (75 in keysDown);
	var shootYellow = (67 in keysDown) || (76 in keysDown);

	/*if (jump) {
		player.dy = -10;
		player.grounded = false;
		player.jumped = true;
	} else if(!up) {
        if(!player.grounded && player.jumped) {
            if(player.dy < 0) {
                player.dy = 0;
            }
        }
}*/
	if(jump && player.grounded) {
		player.grounded = false;
		player.dy = -4;
	}

	if(up && player.jetFuel > 0) {
		player.dy -= PLAYER_JET_ACCEL * dt;
		player.grounded = false;
		player.jetFuel -= PLAYER_FUEL_USE_RATE * dt;
	}

	if (!up && player.jetFuel < PLAYER_JET_FUEL){
		player.jetFuel += PLAYER_FUEL_REGEN_RATE * dt;
	}

	if(doEcho && !echo.active) {
		echo.active = true;
		echo.timer = ECHO_TIME;
		echo.x = player.x + player.width / 2;
		echo.y = player.y + player.height / 2;
		dingSound.play();
	}
	
	if(left) { 
		player.flipped = true;
		player.anim = PLAYER_ANIM_RUN;
		player.animFrameTime = PLAYER_RUN_FRAME_TIME;
		player.loop = true;
		player.dx = -400 * dt;
	} else if(right) {
		player.flipped = false;
		player.anim = PLAYER_ANIM_RUN;
		player.animFrameTime = PLAYER_RUN_FRAME_TIME;
		player.loop = true;
		player.dx = 400 * dt;
	} else {
		player.dx = 0;
		player.anim = PLAYER_ANIM_STAND;
		player.animFrameTime = PLAYER_STAND_FRAME_TIME;
	}

	if(!player.grounded) {
		if(player.anim != PLAYER_ANIM_JUMP) {
			player.animTimer = 0;
		}

		player.anim = PLAYER_ANIM_JUMP;
		player.animFrameTime = PLAYER_JUMP_FRAME_TIME;
		player.loop = false;
	}

	if(player.ammo > 0) {
		var offX = player.flipped ? -(PLAYER_GUN_OFF_X - PLAYER_SPRITE_OFF_X) : PLAYER_GUN_OFF_X;
		var offY = PLAYER_GUN_OFF_Y;

		if(shootRed && player.shotTime <= 0) {
			shootWave(WAVE_SHOT_RED, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
			player.shotTime = PLAYER_SHOT_TIME;
			player.ammo -= 1;
		}

		if(shootBlue && player.shotTime <= 0) {
			shootWave(WAVE_SHOT_BLUE, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
			player.shotTime = PLAYER_SHOT_TIME;
			player.ammo -= 1;
		}

		if(shootYellow && player.shotTime <= 0) {
			shootWave(WAVE_SHOT_YELLOW, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
			player.shotTime = PLAYER_SHOT_TIME;
			player.ammo -= 1;
		}
	}

	if(player.shotTime > 0) {
		player.shotTime -= dt;
	}

	if(Math.abs(player.dy) >= PLAYER_TERMINAL_VEL * dt) {
		player.dy = Math.sign(player.dy) * PLAYER_TERMINAL_VEL * dt;
	}

	move(player, player.dx, player.dy, function() { 
		player.dx = 0; 
	}, function() {
		player.dy = 0;
	});

	if(player.anim) {
		player.frameIndex = Math.floor(player.animTimer / player.animFrameTime);
		if(player.frameIndex >= player.anim.length) {
			if(player.loop) {
				player.frameIndex = 0;
				player.animTimer = 0;
			} else {
				player.frameIndex = player.anim.length - 1;
			}
		}

		player.animTimer += dt;
	}
}

function drawPlayer() {
	if(playerReady) {
		drawFrame(playerImage, player.x - camera.x - PLAYER_SPRITE_OFF_X, player.y - camera.y, player.anim[player.frameIndex], PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, player.flipped);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "20px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Ammo: " + player.ammo, 32, 32);
	ctx.fillText("Health: " + player.health, 32, 64);
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, 100 * (player.jetFuel / PLAYER_JET_FUEL), 20);
}