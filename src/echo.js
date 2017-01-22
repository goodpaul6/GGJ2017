var echo = {
	active : false,
	timer : 0,
	radius : 0,
	x : 0,
	y : 0,
	beatOffset : 0
};

const ECHO_TIME = 1;
const ECHO_SPEED = 600;

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

function drawEcho() {
    if(echo.active) {
        ctx.strokeStyle = "white";

		ctx.beginPath();
		ctx.arc(echo.x - camera.x, echo.y - camera.y, echo.radius, 0, Math.PI * 2);
		ctx.closePath();

		var prevAlpha = ctx.globalAlpha;

		ctx.globalAlpha = echo.timer / ECHO_TIME + 0.05;
		ctx.stroke();
		ctx.globalAlpha = prevAlpha;
	}
}