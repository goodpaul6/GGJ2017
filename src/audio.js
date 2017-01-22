const BEATS_PER_MINUTE = 120;
const TIME_PER_BEAT = 60 / BEATS_PER_MINUTE;

var ost = document.getElementById("ost");
ost.addEventListener("ended", function() {
    this.currentTime = 0;
    this.play();
}, false);

var redSound = document.getElementById("red");
var blueSound = document.getElementById("blue");
var yellowSound = document.getElementById("yellow");
var dingSound = document.getElementById("ding");