var explosions = [];

function addExplosion(x, y) {
    explosions.push({
        x : x,
        y : y,
        frame : 0,
        timer : 0
    });
}

function updateExplosions(dt) {
    for(var i = 0; i < explosions.length; ++i) {
        var explosion = explosions[i];

        explosion.frame = Math.floor(explosion.timer / EXPLOSION_FRAME_TIME);
        if(explosion.frame >= 10) {
            explosions.splice(i, 1);
        }

        explosion.timer += dt;
    }
}

function drawExplosions() {
    if(explosionReady) {
        for(var i = 0; i < explosions.length; ++i) {
            var exp = explosions[i];

            drawFrame(explosionImage, exp.x - camera.x, exp.y - camera.y, exp.frame, EXPLOSION_FRAME_WIDTH, EXPLOSION_FRAME_HEIGHT, false, 4, 4);
        }
    }
}