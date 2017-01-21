var enemies = [];

function createEnemy(x, y) {
    enemies.push({
        name : "bat",
        x : 200,
        y : 300,
        dx : 0,
        dy : 0,
        width : 32,
	    height : 64,
    });
}

/*function updateEnemies(player, dt) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];
    }
}*/