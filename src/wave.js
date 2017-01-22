var waves = [];

const WAVE_SHOT_RED = 0;
const WAVE_SHOT_BLUE = 1;
const WAVE_SHOT_YELLOW = 2;

const WAVE_LIFE = 0.3;
const WAVE_SPEED = 5000;
const WAVE_START_RADIUS = 4;
const WAVE_RADIUS_SPEED = 12;
const WAVE_LINE_WIDTH = 2;
const WAVE_LINE_SPEED = 4;

const WAVE_MAX_LENGTH = 300;
const WAVE_AMPLITUDE = 8;

function shootWave(shot, x, y, dir) {
    waves.push({
        shot : shot, 
        x : x,
        y : y,
        timer : WAVE_LIFE,
        length : 0,
        dir : dir,
        done : false
    });
}

function updateWaves(dt) {
    for(var i = 0; i < waves.length; ++i) {
        var wave = waves[i];
    
        if(Math.abs(wave.length) >= WAVE_MAX_LENGTH) {
            wave.done = true;
            wave.length = Math.sign(wave.length) * WAVE_MAX_LENGTH;
        }

        if(collideLevel(wave.x, wave.y - WAVE_AMPLITUDE / 2, wave.length, WAVE_AMPLITUDE)) {
            wave.done = true;
        }

        if(!wave.done) {
            if(wave.dir > 0) {
                collideEnemy(wave.x, wave.y - WAVE_AMPLITUDE / 2, wave.length, WAVE_AMPLITUDE, function(e) {
                    if(e.color == wave.shot) {
                        e.hit = true;
                        wave.done = true;
                        wave.length -= wave.dir * e.width / 1.5;
                    }
                });
            } else {
                collideEnemy(wave.x + wave.length, wave.y - WAVE_AMPLITUDE / 2, -wave.length, WAVE_AMPLITUDE, function(e) {
                    if(e.color == wave.shot) {
                        e.hit = true;
                        wave.done = true;
                        wave.length -= wave.dir * e.width / 1.5;
                    }
                });
            }
            
            wave.length += WAVE_SPEED * dt * wave.dir;
        } else {
            if(wave.timer <= 0.1) {
                waves.splice(i, 1);
            }
            wave.timer -= dt;
        }
    }
}

function drawWaves() {
    for(var i = 0; i < waves.length; ++i) {
        var wave = waves[i];

        var prevAlpha = ctx.globalAlpha;

        ctx.globalAlpha = wave.timer / WAVE_LIFE;
        if(ctx.globalAlpha < 0) {
            ctx.globalAlpha = 0;
        }

        var waveImage = null;
        if(wave.shot == WAVE_SHOT_RED) {
            ctx.strokeStyle = "red";
            waveImage = redWaveImage;
        } else if(wave.shot == WAVE_SHOT_BLUE) {
            ctx.strokeStyle = "blue";
            waveImage = blueWaveImage;
        } else if(wave.shot == WAVE_SHOT_YELLOW) {
            ctx.strokeStyle = "yellow";
            waveImage = yellowWaveImage;
        }

        if(wave.dir < 0) { 
            ctx.drawImage(waveImage, wave.x - camera.x + wave.length, wave.y - camera.y - WAVE_AMPLITUDE, -wave.length, WAVE_AMPLITUDE * 2);
        } else {
            ctx.drawImage(waveImage, wave.x - camera.x, wave.y - camera.y - WAVE_AMPLITUDE, wave.length, WAVE_AMPLITUDE * 2);
        }

        ctx.beginPath();

        ctx.moveTo(wave.x - camera.x, wave.y - camera.y);
        for(var j = 0; j < 360; j += 10) {
            var x = wave.x - camera.x + (j / 360) * wave.length;
            var y = wave.y + Math.sin(wave.x + j * 60) * WAVE_AMPLITUDE - camera.y;

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

        ctx.globalAlpha = prevAlpha;
    }
}