"use strict";

var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : PLAYER_FRAME_WIDTH,
	height : PLAYER_FRAME_HEIGHT,
	grounded : false,
	frameIndex : 0,
	anim : PLAYER_ANIM_STAND,
	animTimer : 0,
	animFrameTime : 1 / 12,
	flipped : false,
    jumped : false
};

function move(ent, x, y, collideX, collideY) {
	if(collideLevel(ent.x + x, ent.y + y, ent.width, ent.height)) {
		const SAMPLES = 5;

		var moveX = x / SAMPLES;
		var moveY = y / SAMPLES;

		for(var i = 0; i < SAMPLES; ++i) {
			if(!collideLevel(ent.x + moveX, ent.y, ent.width, ent.height)) {
				ent.x += moveX;
			} else {
				collideX();
				break;
			}
		}
		
		for(var i = 0; i < SAMPLES; ++i) {
			if(!collideLevel(ent.x, ent.y + moveY, ent.width, ent.height)) {
				ent.y += moveY;
			} else {
				collideY();
				break;
			}
		}
	} else {
		ent.x += x;
		ent.y += y;
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
	
	var doEcho = 32 in keysDown;
	var left = (37 in keysDown) || (65 in keysDown);
	var right = (39 in keysDown) || (68 in keysDown);
	var jump = (38 in keysJustPressed) || (87 in keysJustPressed);
	var up = (38 in keysDown) || (87 in keysDown);
    var down = (40 in keysDown) || (83 in keysDown);
	
	if (jump) {
		if(player.grounded) {
			player.dy = -10;
			player.grounded = false;
            player.jumped = true;
        }
	} else if(!up) {
        if(!player.grounded && player.jumped) {
            if(player.dy < 0) {
                player.dy = 0;
            }
        }
    }

	if(doEcho && !echo.active) {
		echo.active = true;
		echo.timer = ECHO_TIME;
		echo.x = player.x + player.width / 2;
		echo.y = player.y + player.height / 2;
		dingSound.play();
	}

	if (down) {
		player.dy += 50 * dt;
	}
	
	if(left) { 
		player.flipped = true;
		player.anim = PLAYER_ANIM_RUN;
		player.dx = -300 * dt;
	} else if(right) {
		player.flipped = false;
		player.anim = PLAYER_ANIM_RUN;
		player.dx = 300 * dt;
	} else {
		player.dx = 0;
		player.anim = PLAYER_ANIM_STAND;
	}

	if(!player.grounded) {
		player.anim = PLAYER_ANIM_JUMP;
	}

	move(player, player.dx, player.dy, function() { 
		player.dx = 0; 
	}, function() {
		player.dy = 0;
	});

	if(player.anim) {
		player.frameIndex = Math.floor(player.animTimer / player.animFrameTime);
		if(player.frameIndex >= player.anim.length) {
			player.frameIndex = 0;
			player.animTimer = 0;
		}

		player.animTimer += dt;
	}
}