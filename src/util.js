function safeWidth() {
	var inner = window.innerWidth,
		client = document.documentElement.clientWidth || inner,
		body = document.getElementsByTagName('body')[0].clientWidth || inner;

	return Math.min(inner, client, body);
}

function safeHeight() {
	var inner = window.innerHeight,
		client = document.documentElement.clientHeight || inner,
		body = document.getElementsByTagName('body')[0].clientHeight || inner;

	return Math.min(inner, client, body) - 5;
}

function pixelated(context) {
	var smooth = false;
	context.mozImageSmoothingEnabled = smooth;
	context.webkitImageSmoothingEnabled = smooth;
	context.msImageSmoothingEnabled = smooth;
	context.imageSmoothingEnabled = smooth;
}