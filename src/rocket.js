var rockets = [];

const ROCKET_SPEED = 400;
const ROCKET_SIZE = 8;

function shootRocket(x, y, angle) {
    rockets.push({
        x : x,
        y : y,
        angle : angle
    });
}

function updateRockets(dt) {
    for(var i = 0; i < rockets.length; ++i) {
        var rocket = rockets[i];

        rocket.x += Math.cos(rocket.angle) * ROCKET_SPEED * dt;
        rocket.y += Math.sin(rocket.angle) * ROCKET_SPEED * dt;
    
        if(collideLevelCircle(rocket.x + rocketImage.width / 2, rocket.y + rocketImage.height / 2, ROCKET_SIZE / 2)) {
            // TODO: Explosion
            rockets.splice(i, 1);
        }
    }
}

function drawRockets() {
    if(rocketReady) {
        for(var i = 0; i < rockets.length; ++i) {
            var rocket = rockets[i];

            ctx.save();

            ctx.translate(rocket.x - camera.x, rocket.y - camera.y);

            ctx.translate(rocketImage.width / 2, rocketImage.height / 2);
            ctx.rotate(rocket.angle);
            ctx.translate(-rocketImage.width / 2, -rocketImage.height / 2);
            
            ctx.drawImage(rocketImage, 0, 0);

            ctx.restore();

            ctx.beginPath();
            ctx.arc(rocket.x - camera.x + rocketImage.width / 2, rocket.y - camera.y + rocketImage.height / 2, ROCKET_SIZE / 2, 0, Math.PI * 2);
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
}