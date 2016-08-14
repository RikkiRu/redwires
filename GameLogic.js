function GameLogic()
{
	this.cameraSpeed = 1;
}

GameLogic.prototype.start = function()
{
	console.log("GameLogic.start()");
	
	var o1 = new GameObject("o1");
	o1.size = new Size(11, 11, true);
	o1.point = new Point(100, 50);
	game.scene.add(o1);
}

GameLogic.prototype.processKeys = function(dt)
{
	var input = game.input;
	var ds = this.cameraSpeed * dt;
	
	var dx = 0;
	var dy = 0;
	
	if (input.key("W")) { dy =  ds; }
	if (input.key("S")) { dy = -ds; }
	if (input.key("A")) { dx =  ds; }
	if (input.key("D")) { dx = -ds; }
	
	if (dx != 0 || dy != 0)
	{
		game.render.saveCamera();
		game.render.camera.x += dx;
		game.render.camera.y += dy;
		game.scene.markDirtyAll();
	}
}

GameLogic.prototype.update = function(dt)
{
	this.processKeys(dt);
}