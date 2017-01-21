"use strict";

var canvas = null;
var ctx = null;

var keysDown = {};
var keysJustPressed = {};

var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : 32,
	height : 48,
	grounded : false,
	doubleJumped : false
};

var camera = {
	x : 0,
	y : 0
}

var level = TileMaps["level"];

function collideLevel(x, y, w, h) {
	var left = Math.floor(x / level.tilewidth);
	var top = Math.floor(y / level.tileheight);
	var right = Math.ceil((x + w) / level.tilewidth);
	var bottom = Math.ceil((y + h) / level.tileheight);

	for(var y = top; y < bottom; ++y) {
		for(var x = left; x < right; ++x) {
			if(level.layers[0].data[x + y * level.width] > 0) {
				return true;
			}
		}
	}

	return false;
}

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

function init() {
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);

	canvas.width = 640;
	canvas.height = 480;

	canvas.style["position"] = "fixed";
	canvas.style["top"] = "50%";
	canvas.style["left"] = "50%";
	canvas.style["transform"] = "translate(-50%, -50%)";
	
	ctx = canvas.getContext("2d");

	document.addEventListener("keydown", function(e) {
		keysDown[e.keyCode] = true;
		keysJustPressed[e.keyCode] = true;
	});
	
	document.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
		delete keysJustPressed[e.keyCode];
	});
}

const CAMERA_SPEED_FACTOR = 5;

function update(dt) {
	camera.x += (player.x - canvas.width / 2 - camera.x) * dt * CAMERA_SPEED_FACTOR;
	camera.y += (player.y - canvas.height / 2 - camera.y) * dt * CAMERA_SPEED_FACTOR;

	if(collideLevel(player.x, player.y + 1, player.width, player.height)) {
		player.grounded = true;
		player.doubleJumped = false;
		player.dy = 0;
	} else {
		player.grounded = false;
		player.dy += 16 * dt;
	}
	
	var left = (37 in keysDown) || (65 in keysDown);
	var right = (39 in keysDown) || (68 in keysDown);
	var jump = (38 in keysJustPressed) || (87 in keysJustPressed);
	var down = (40 in keysDown) || (83 in keysDown);
	
	if (jump) {
		if(player.grounded) {
			player.dy = -10;
			player.grounded = false;
		} else if(!player.doubleJumped) {
			player.dy = -10;
			player.doubleJumped = true;
		}
	}

	if (down) {
		player.dy += 50 * dt;
	}
	
	if(left) { 
		player.dx = -300 * dt;
	} else if(right) {
		player.dx = 300 * dt;
	} else {
		player.dx = 0;
	}

	move(player, player.dx, player.dy, function() { 
		player.dx = 0; 
	}, function() {
		player.dy = 0;
	});
}

function draw() {
	camera.x = Math.floor(camera.x);
	camera.y = Math.floor(camera.y);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var layer = level.layers[0];

	ctx.fillStyle = "blue";
	for(var y = 0; y < layer.height; ++y) {
		for(var x = 0; x < layer.width; ++x) {
			var tile = layer.data[x + y * layer.width];
			if(tile > 0) {
				ctx.fillRect(x * level.tilewidth - camera.x, y * level.tileheight - camera.y, level.tilewidth, level.tileheight);	
			}
		}
	}

	ctx.fillStyle = "red";
	ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
}

var then = Date.now();

function loop() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	draw();
	
	keysJustPressed = {};

	then = now;
	
	requestAnimationFrame(loop);
}

init();
loop();



