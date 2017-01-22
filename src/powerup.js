var powers = [];

const POWERUP_PICK_DIST = 10;
const POWERUP_AMMO = 0;
const POWERUP_AMMO_AMOUNT = 10;

function spawnPowerup(x, y, type) {
    powers.push({
        x : x,
        y : y,
        type : type,
    });
}

function updatePowerups(dt) {
    for(var i = 0; i < powers.length; ++i) {
        var power = powers[i];

        if(power.type == POWERUP_AMMO) {
            var dist2 = distanceSqr(power.x, power.y, player.x, player.y);

            if(dist2 < POWERUP_PICK_DIST * POWERUP_PICK_DIST) {
                powers.splice(i, 1);
                player.ammo += POWERUP_AMMO_AMOUNT;
            }
        }
    }
}