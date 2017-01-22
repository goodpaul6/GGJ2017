var spawners = [];

const SPAWN_COUNT_FACTOR = 5;
const SPAWN_WAIT_TIME_MIN = 20;
const SPAWN_WAIT_TIME_MAX = 25;

var spawnLevel = 1;
var spawnCount = 5;

var spawnWait = 0;

function createSpawner(x, y, type, color) {
    spawners.push({
        x : x,
        y : y,
        type : type,
        color : color,
        timer : 0
    });
}

function updateSpawners(dt) {
    if(spawnWait > 0) {
        spawnWait -= dt;
        if(spawnWait < 0) {
            ++spawnLevel;
            spawnCount = spawnLevel * SPAWN_COUNT_FACTOR;
        }
        return;
    }

    for(var i = 0; i < spawners.length; ++i) {
        var spawner = spawners[i];

        if(spawner.timer <= 0) {
            --spawnCount;
            if(spawnCount == 0) {
                spawnWait = 20;
                break;
            }

            createEnemy(spawner.type, spawner.x, spawner.y, spawner.color);
            spawner.timer += Math.random() * (SPAWN_WAIT_TIME_MAX - SPAWN_WAIT_TIME_MIN) + SPAWN_WAIT_TIME_MIN;
        }

        spawner.timer -= dt;
    }
}

function drawSpawners(dt) {
    for(var i = 0; i < spawners.length; ++i) {
        var spawner = spawners[i];

        ctx.drawImage(doorImage, spawner.x, spawner.y);
    }
}