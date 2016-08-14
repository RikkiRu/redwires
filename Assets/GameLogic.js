function GameLogic()
{
	this.cameraSpeed = 1;
	this.counter = 0;
	this.colorPresets = new ColorPresets();
}

GameLogic.prototype.getNewId = function()
{
	this.counter++;
	return this.counter;
}

GameLogic.prototype.start = function()
{
	console.log("GameLogic.start()");
	
	var model = new Model();
	
	var rm1 = new RedModule();
	var rmd1 = new RedModuleDrawer(rm1, this.getNewId());
	game.scene.add(rmd1);
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