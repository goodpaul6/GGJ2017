var powers = [];

const POWERUP_PICK_DIST = 32;

const POWERUP_AMMO = 0;
const POWERUP_COUNT = 1;

const POWERUP_AMMO_AMOUNT = 10;

function spawnPowerup(x, y, type) {
    powers.push({
        x : x,
        y : y,
        type : type
    });
}

function updatePowerups(dt) {
    for(var i = 0; i < powers.length; ++i) {
        var power = powers[i];

        if(power.type == POWERUP_AMMO) {
            var dist2 = distanceSqr(power.x + powerImage.width / 2, power.y + power.height / 2, player.x + player.width / 2, player.y + player.height / 2);

            if(dist2 < POWERUP_PICK_DIST * POWERUP_PICK_DIST) {
                powers.splice(i, 1);
                player.ammo += POWERUP_AMMO_AMOUNT;
            }
        }
    }
}

function drawPowerups() {
    for(var i = 0; i < powers.length; ++i) {
        var power = powers[i];

        if(power.type == POWERUP_AMMO) {
            if(ammoReady) {
                ctx.drawImage(ammoImage, power.x - camera.x, power.y - camera.y);
            }
        }       
    }
}