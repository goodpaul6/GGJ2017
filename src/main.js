"use strict";

var canvas = null;
var ctx = null;

var keysDown = {};

var player = {
	x : 0,
	y : 0,
	dx : 0,
	dy : 0,
	width : 32,
	height : 64,
	grounded : false
};

var level = TileMaps["level"]["layers"][0];

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
	});
	
	document.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
	});
}

function update(dt) {
	if(player.y + player.height < canvas.height) {
		player.dy += 10 * dt;
	} else {
		player.y = canvas.height - player.height;
		player.dy = 0;
		player.grounded = true;
	}
	
	var left = (37 in keysDown) || (65 in keysDown);
	var right = (39 in keysDown) || (68 in keysDown);
	var up = (38 in keysDown) || (87 in keysDown);
	var down = (40 in keysDown) || (83 in keysDown);
	
	if(player.grounded && up) {
		player.dy = -10;
		player.grounded = false;
	}
	
	if(left) { 
		player.dx = -300 * dt;
	} else if(right) {
		player.dx = 300 * dt;
	} else {
		player.dx = 0;
	}
	
	player.x += player.dx;
	player.y += player.dy;
}

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "blue";
	for(var y = 0; y < level.height; ++y) {
		for(var x = 0; x < level.width; ++x) {
			var tile = level.data[x + y * level.width];
			if(tile > 0) {
				ctx.fillRect(x * 32, y * 32, 32, 32);	
			}
		}
	}

	ctx.fillStyle = "red";
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

var then = Date.now();

function loop() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	draw();
	
	then = now;
	
	requestAnimationFrame(loop);
}

init();
loop();



