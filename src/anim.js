"use strict";

var anims = {};

function addAnim(name, image, frames, frameTime, frameWidth, frameHeight) {
    anims[name] = {
        image:  image,
        timer : 0,
        frames : frames,
        frameTime : frameTime,
        frameWidth : frameWidth,
        frameHeight : frameHeight,
        frameIndex : 0
    };
}

function drawFrame(image, x, y, frame, fw, fh, flip) {
	var columns = image.width / fw;
	
	var u = frame % columns;
	var v = Math.floor(frame / columns);

	if(!flip) {
		ctx.drawImage(image, u * fw, v * fh, fw, fh, x, y, fw, fh);
	} else {
		ctx.save();
		
		ctx.translate(x + fw, y);
		ctx.scale(-1, 1);

		ctx.drawImage(image, u * fw, v * fh, fw, fh, 0, 0, fw, fh);

		ctx.restore();
	}
}

function updateAnim(name, dt) {
    var anim = anims[name];
    if(anim) {
    	anim.frameIndex = Math.floor(anim.timer / anim.frameTime);
		if(anim.frameIndex >= anim.frames.length) {
			anim.frameIndex = 0;
			anim.timer = 0;
		}

		anim.timer += dt;
    }
}

function drawAnim(name, x, y, flip) {
    var anim = anims[name];
    if(anim) {
        drawFrame(anim.image, x, y, anim.frames[anim.frameIndex], anim.frameWidth, anim.frameHeight, flip);
    }
}