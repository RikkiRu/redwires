function Input(canvas, camera)
{
	this.keys = {};
	this.canvas = canvas;
	this.camera = camera;
}

Input.prototype.start = function()
{
	document.addEventListener('keydown', function(e) { game.input.toggleKey(e, true); });
	document.addEventListener('keyup', function(e) { game.input.toggleKey(e, false); });
	window.addEventListener('blur', function() { game.input.keys = {}; });
	this.canvas.addEventListener("click", function(event) { game.input.raiseClick(game.input.getGameCoords(event, this), "LEFT"); });
	this.canvas.oncontextmenu = function(event) { game.input.raiseClick(game.input.getGameCoords(event, this), "RIGHT"); return false; };
}
	
Input.prototype.key = function(key)
{
	key = key.toUpperCase();
	return this.keys[key];
}

Input.prototype.toggleKey = function(e, status)
{
	var code = e.keyCode;
	var key;
	
	switch(code) 
	{
		case 32:
			key = "SPACE"; break;
		case 37:
			key = "LEFT"; break;
		case 38:
			key = "UP"; break;
		case 39:
			key = "RIGHT"; break;
		case 40:
			key = "DOWN"; break;
		default:
			key = String.fromCharCode(code).toUpperCase();
    }
	
    this.keys[key] = status;
};

	
Input.prototype.raiseClick = function(coords, button)
{
};

Input.prototype.getGameCoords = function(e, context)
{
	var coords = context.getBoundingClientRect();
    var offsetX = Number(e.clientX - coords.left);
    var offsetY = Number(e.clientY - coords.top);
	return { x: -this.camera.x + offsetX * this.canvas.width / this.canvas.offsetWidth, y: -this.camera.y + offsetY * this.canvas.height / this.canvas.offsetHeight };
};