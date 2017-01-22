var rockets = [];

const ROCKET_SPEED = 400;
const ROCKET_SIZE = 8;
const ROCKET_STEER_FACTOR = 5;

const ROCKET_SPRITE_OFF_X = 7;
const ROCKET_SPRITE_OFF_Y = 6;

const ROCKET_WIDTH = 

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

        /*var dist2player = distanceSqr(player.x + player.width / 2, player.y + player.height / 2, rocket.x, rocket.y);

        if(dist2player < 32 * 32) {
            addExplosion(rocket.x - EXPLOSION_FRAME_WIDTH / 2, rocket.y - EXPLOSION_FRAME_HEIGHT / 2);
            rockets.splice(i, 1);
            player.health -= 1;
        }*/

        collidePlayer(rocket.x, rocket.y, rocket)

        if(collideLevelCircle(rocket.x + rocketImage.width / 2, rocket.y + rocketImage.height / 2, ROCKET_SIZE / 2)) {
            addExplosion(rocket.x - EXPLOSION_FRAME_WIDTH / 2, rocket.y - EXPLOSION_FRAME_HEIGHT / 2);
            rockets.splice(i, 1);
        }

        if(echo.active)  {
            var dist2 = distanceSqr(rocket.x, rocket.y, echo.x, echo.y);

            if(dist2 < echo.radius * echo.radius) {
                addExplosion(rocket.x - EXPLOSION_FRAME_WIDTH / 2, rocket.y - EXPLOSION_FRAME_HEIGHT / 2);
                rockets.splice(i, 1);
            }
        }

        rocket.x += Math.cos(rocket.angle) * ROCKET_SPEED * dt;
        rocket.y += Math.sin(rocket.angle) * ROCKET_SPEED * dt;
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

            /*ctx.beginPath();
            ctx.arc(rocket.x - camera.x + rocketImage.width / 2, rocket.y - camera.y + rocketImage.height / 2, ROCKET_SIZE / 2, 0, Math.PI * 2);
            ctx.strokeStyle = "red";
            ctx.stroke();*/
        }
    }
}