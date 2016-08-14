function GameLogic()
{
	this.cameraSpeed = 1;
	this.counter = 0;
	this.colorPresets = new ColorPresets();
	this.mousePoint = null;
	this.mouseDown = false;
	this.wasDrag = false;
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
	
	for (var i in model.parts)
	{
		var part = model.parts[i];
		var rmd1 = new RedModuleDrawer(part.target, this.getNewId());
		game.scene.add(rmd1);
	}
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
	
	if (this.mousePoint != null)
	{
		var point = this.mousePoint;
		var o = game.scene.getIntersect(point);
		
		if (o != null && o.draggable)
		{
			if (this.mouseDown)
			{
				o.drag(point);
				this.wasDrag = true;
			}
			else
			{
				if (this.wasDrag)
				{
					this.wasDrag = false;
					o.dragEnd();
				}
			}
		}
		
		if (this.hoverObject == o)
			return;
		
		if (this.hoverObject != null)
		{
			this.hoverObject.hover = false;
			this.hoverObject.markDirty();
		}
		
		this.hoverObject = o;
		if (o != null)
		{
			o.hover = true;
			o.markDirty();
		}
		
		this.mousePoint = null;
	}
}

GameLogic.prototype.update = function(dt)
{
	this.processKeys(dt);
}

GameLogic.prototype.mouseMove = function(point)
{
	this.mousePoint = point;
}

GameLogic.prototype.mouseChange = function(down)
{
	this.mouseDown = down;
}