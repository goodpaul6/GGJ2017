var waves = [];

const WAVE_SHOT_RED = 0;
const WAVE_SHOT_BLUE = 1;
const WAVE_SHOT_YELLOW = 2;

const WAVE_LIFE = 4;
const WAVE_SPEED = 400;
const WAVE_RADIUS_SPEED = Math.PI * 6;

function shootWave(shot, x, y, dir) {
    waves.push({
        shot : shot, 
        x : x,
        y : y,
        timer : 0,
        dir : dir,
        radius : 0
    });
}

function updateWaves(dt) {
    for(var i = 0; i < waves.length; ++i) {
        var wave = waves[i];
    
        wave.x += WAVE_SPEED * wave.dir * dt;    
        wave.radius += WAVE_RADIUS_SPEED * dt;
        
        if(collideLevel(wave.x, wave.y, 2, 2)) {
            waves.splice(i, 1);
        }

        wave.timer += dt;
    }
}

function drawWaves() {
    for(var i = 0; i < waves.length; ++i) {
        var wave = waves[i];

        if(wave.shot == WAVE_SHOT_RED) {
            ctx.strokeStyle = "red";
        } else if(wave.shot == WAVE_SHOT_BLUE) {
            ctx.strokeStyle = "blue";
        } else if(wave.shot == WAVE_SHOT_YELLOW) {
            ctx.strokeStyle = "yellow";
        }

        ctx.beginPath();
        ctx.arc(wave.x - camera.x, wave.y - camera.y, wave.radius, -Math.PI / 4, Math.PI / 4);

        ctx.stroke();
    }
}