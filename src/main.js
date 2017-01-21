"use strict";

var canvas = null;
var ctx = null;

var keysDown = {};
var keysJustPressed = {};

var echo = {
	active : false,
	timer : 0,
	radius : 0,
	x : 0,
	y : 0
};

var camera = {
	x : 0,
	y : 0
};

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

	pixelated(ctx);

	document.addEventListener("keydown", function(e) {
		if(!(e.keyCode in keysDown)) {
			keysJustPressed[e.keyCode] = true;
		}

		keysDown[e.keyCode] = true;
	});
	
	document.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
		delete keysJustPressed[e.keyCode];
	});

	for(var i = 0; i < level.layers.length; ++i) {
		var layer = level.layers[i];

		if(layer.name == "Entities") {
			for(var i = 0; i < layer.objects.length; ++i) {
				var object = layer.objects[i];

				if(object.type == "player") {
					player.x = object.x;
					player.y = object.y;
				} else if(object.type == "enemy") {
					createEnemy(object.x + level.tilewidth / 2, object.y + level.tileheight / 2);
				}
			}
		}
	}
}

const ECHO_TIME = 1;
const ECHO_SPEED = 300;
const CAMERA_SPEED_FACTOR = 5;

function updateEcho(dt) {
	if(echo.active) {
		echo.timer -= dt;
		if(echo.timer <= 0) {
			echo.active = false;
			echo.radius = 0;
		}

		echo.radius += ECHO_SPEED * dt;
	}
}

function update(dt) {
	camera.x += (player.x + player.width / 2 - canvas.width / 2 - camera.x) * dt * CAMERA_SPEED_FACTOR;
	camera.y += (player.y + player.height / 2 - canvas.height / 2 - camera.y) * dt * CAMERA_SPEED_FACTOR;

	updateEnemies(dt);
	updatePlayer(dt);
	updateEcho(dt);
}

function drawFrame(image, x, y, frame, fw, fh, flip) {
	var columns = image.width / fw;
	
	var u = frame % columns;
	var v = Math.floor(frame / columns);

	if(!flip) {
		ctx.drawImage(image, u * fw, v * fh, fw, fh, x, y, fw, fh);
	} else {
		ctx.save();
		
		ctx.translate(x + fw, y);
		ctx.scale(-1, 1);

		ctx.drawImage(image, u * fw, v * fh, fw, fh, 0, 0, fw, fh);

		ctx.restore();
	}
}

function draw() {
	camera.x = Math.floor(camera.x);
	camera.y = Math.floor(camera.y);

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var layer = level.layers[0];

	if(groundReady) {
		for(var y = 0; y < layer.height; ++y) {
			for(var x = 0; x < layer.width; ++x) {
				var tile = layer.data[x + y * layer.width];
				if(tile > 0) {
					tile -= 1;
					drawFrame(ground, x * level.tilewidth - camera.x, y * level.tileheight - camera.y, tile, level.tilewidth, level.tileheight, false);
				}
			}
		}
	}

	if(playerReady) {
		drawFrame(playerImage, player.x - camera.x, player.y - camera.y, player.anim[player.frameIndex], PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, player.flipped);
	}

	if(echo.active) {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.arc(echo.x - camera.x, echo.y - camera.y, echo.radius, 0, Math.PI * 2);
		ctx.closePath();

		var prevAlpha = ctx.globalAlpha;

		ctx.globalAlpha = echo.timer / ECHO_TIME;
		ctx.stroke();
		ctx.globalAlpha = prevAlpha;
	}

	drawEnemies();
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



