var powers = [];

const POWERUP_PICK_DIST = 76;

const POWERUP_AMMO = 0;
const POWERUP_HEART = 1;
const POWERUP_COUNT = 2;

const POWERUP_AMMO_AMOUNT = 1;
const POWERUP_GRAB_BAG = [
    POWERUP_AMMO,
    POWERUP_AMMO,
    POWERUP_HEART,
    POWERUP_HEART,
    POWERUP_HEART,
    POWERUP_HEART,
    POWERUP_HEART,
    POWERUP_HEART,
    POWERUP_HEART,
    POWERUP_HEART,
];

var powerupImages = [
    ammoImage,
    heartImage
];

function spawnPowerup(x, y, type) {
    powers.push({
        x : x,
        y : y,
        dx : 0,
        dy : 0,
        width : powerupImages[type].width,
        height : powerupImages[type].height,
        type : type
    });
}

function updatePowerups(dt) {
    for(var i = 0; i < powers.length; ++i) {
        var power = powers[i];
        
        power.dy += 16 * dt;

        /*var dist2 = distanceSqr(power.x, power.y, player.x + player.width / 2, player.y + player.height / 2);

        if(dist2 < POWERUP_PICK_DIST * POWERUP_PICK_DIST)*/
        
        collidePlayer(power.x, power.y, power.width, power.height, function() {
            powers.splice(i, 1);
            if(power.type == POWERUP_AMMO) {
                player.ammo += POWERUP_AMMO_AMOUNT;
            } else if(power.type == POWERUP_HEART) {
                player.health += 1;
            }
        });

        move(power, power.dx, power.dy, function() {
            power.dx = 0;
        }, function() {
            power.dy = 0;
        });
    }
}

function drawPowerups() {
    for(var i = 0; i < powers.length; ++i) {
        var power = powers[i];

        ctx.drawImage(powerupImages[power.type], power.x - camera.x, power.y - camera.y);
    }
}