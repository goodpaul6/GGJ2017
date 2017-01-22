var waves = [];

const WAVE_SHOT_RED = 0;
const WAVE_SHOT_BLUE = 1;
const WAVE_SHOT_YELLOW = 2;

const WAVE_LIFE = 4;
const WAVE_SPEED = 600;
const WAVE_START_RADIUS = 4;
const WAVE_RADIUS_SPEED = 12;
const WAVE_LINE_WIDTH = 2;
const WAVE_LINE_SPEED = 4;

const WAVE_LENGTH = 40;
const WAVE_AMPLITUDE = 7;

function shootWave(shot, x, y, dir) {
    waves.push({
        shot : shot, 
        x : x,
        y : y,
        timer : 0,
        dir : dir
    });
}

function updateWaves(dt) {
    for(var i = 0; i < waves.length; ++i) {
        var wave = waves[i];
    
        wave.x += WAVE_SPEED * wave.dir * dt;    
        
        if(collideLevel(wave.x, wave.y, 2, 2)) {
            waves.splice(i, 1);
        }

        if(collideEnemy(wave.x, wave.y - WAVE_AMPLITUDE / 2, WAVE_LENGTH, WAVE_AMPLITUDE, function(e) {
            e.hit = true;
            waves.splice(i, 1);
        }));

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

        ctx.moveTo(wave.x - camera.x, wave.y - camera.y);
        for(var j = 0; j < 360; j += 10) {
            var x = wave.x - camera.x + (j / 360) * WAVE_LENGTH;
            var y = wave.y + Math.sin(wave.x + ((j * Math.PI) / WAVE_LENGTH)) * WAVE_AMPLITUDE - camera.y;

            ctx.lineTo(x, y);
            ctx.moveTo(x, y);
        }

        /*if(wave.dir < 0) {
            ctx.arc(wave.x + wave.radius - camera.x, wave.y - camera.y, wave.radius, Math.PI - Math.PI / 4, Math.PI + Math.PI / 4);
        } else {
            ctx.arc(wave.x - wave.radius - camera.x, wave.y - camera.y, wave.radius, -Math.PI / 4, Math.PI / 4);
        }*/

        var prevLineWidth = ctx.lineWidth;

        ctx.lineWidth = WAVE_LINE_WIDTH;
        ctx.stroke();
        
        ctx.lineWidth = prevLineWidth;
    }
}