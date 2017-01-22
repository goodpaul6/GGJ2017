"use strict";

var canvas = null;
var ctx = null;

var keysDown = {};
var keysJustPressed = {};

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

	if(right < left) {
		var tmp = left;
		left = right;
		right = tmp;
	}

	if(bottom < top) {
		var tmp = top;
		top = bottom;
		bottom = tmp;
	}

	for(var y = top; y < bottom; ++y) {
		for(var x = left; x < right; ++x) {
			if(level.layers[0].data[x + y * level.width] > 0) {
				return true;
			}
		}
	}

	return false;
}

function collideLineLevel(x1, y1, x2, y2) {
	return collideLevel(x1, y1, x2 - x1, y2 - y1);
}

function collideLevelCircle(x, y, radius) {
	var left = Math.floor((x - radius) / level.tilewidth);
	var right = Math.ceil((x + radius) / level.tilewidth);
	var top = Math.floor((y - radius) / level.tileheight);
	var bottom = Math.ceil((y + radius) / level.tileheight);

	for(var y = top; y < bottom; ++y) {
		for(var x = left; x < right; ++x) {
			var tile = level.layers[0].data[x + y * level.width];
			if(tile > 0) {
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
					createEnemy(ENEMY_TYPE_ROCKET, object.x + level.tilewidth / 2, object.y + level.tileheight / 2);
				}
			}
		}
	}
}

const CAMERA_SPEED_FACTOR = 5;


/*function updateEcho(dt) {
	if (echo.frequency === ECHO_NORMAL_FREQ){
		echo.timer -= dt;
		if(echo.timer <= 0) {
			echo.active = false;
			echo.radius = 0;
		}

		echo.radius += ECHO_SEED * dt;
	}
}*/

function update(dt) {
	camera.x += (player.x + player.width / 2 - canvas.width / 2 - camera.x) * dt * CAMERA_SPEED_FACTOR;
	camera.y += (player.y + player.height / 2 - canvas.height / 2 - camera.y) * dt * CAMERA_SPEED_FACTOR;

	updateEnemies(dt);
	updateRockets(dt);
	updatePlayer(dt);
	updateEcho(dt);
	updateWaves(dt);
	updateExplosions(dt);
}

function drawFrame(image, x, y, frame, fw, fh, flip, scaleX, scaleY) {
	scaleX = scaleX || 1;
	scaleY = scaleY || 1;

	var columns = image.width / fw;
	
	var u = frame % columns;
	var v = Math.floor(frame / columns);

	if(!flip) {
		ctx.drawImage(image, u * fw, v * fh, fw, fh, x, y, fw * scaleX, fh * scaleY);
	} else {
		ctx.save();
		
		ctx.translate(x + fw, y);
		ctx.scale(-1, 1);

		ctx.drawImage(image, u * fw, v * fh, fw, fh, 0, 0, fw, fh);

		ctx.restore();
	}
}

function drawStars() {
	for(var y = 0; y < 20; ++y) {
		for(var x = 0; x < 20; ++x) {
			ctx.drawImage(starImage, x * 32, y * 32);	
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.x = Math.floor(camera.x);
	camera.y = Math.floor(camera.y);

	ctx.fillStyle = "#00001D";
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


	/*if(player.echoTime > 0) {
		if(echo.freq == ECHO_NORMAL_FREQ) {
			ctx.fillStyle = "white";
		} else if(echo.freq == ECHO_RED_FREQ) {
			ctx.fillStyle = "red";
		} else if(echo.freq == ECHO_BLUE_FREQ) {
			ctx.fillStyle = "blue";
		} else if(echo.freq == ECHO_YELLOW_FREQ) {
			ctx.fillStyle = "yellow";
		}

		ctx.fillRect(player.x + player.width / 2 - ECHO_DISP_WIDTH / 2 - camera.x, player.y + player.height / 2 - ECHO_DISP_HEIGHT / 2 - camera.y, 
			ECHO_DISP_WIDTH, ECHO_DISP_HEIGHT);
	}*/

	drawPlayer();
	drawEcho();
	drawWaves();
	drawEnemies();
	drawRockets();
	drawExplosions();
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



