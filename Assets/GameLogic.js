function GameLogic()
{
	this.cameraSpeed = 1;
	this.counter = 0;
	this.colorPresets = new ColorPresets();
	this.mousePoint = null;
	this.mousePointSaved = null;
	this.mouseDown = false;
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
	this.model = model;
	
	for (var i in model.parts)
	{
		var part = model.parts[i];
		var rmd1 = new RedModuleDrawer(model, i, part.target, this.getNewId());
		game.scene.add(rmd1);
	}
}

GameLogic.prototype.processMouse = function()
{
	if (this.mousePoint != null)
	{
		var point = this.mousePoint;
		this.mousePoint = null;
		var array = game.scene.getIntersect(point);
		
		if (this.hoverObject != null)
		{
			if (!this.mouseDown)
			{
				this.hoverObject.dragEnd(array);
				this.hoverObject = null;
			}
			else
			{
				this.hoverObject.drag(point);
			}
		}
		else
		{
			if (this.mouseDown)
			{
				for (var i=0; i<array.length; i++)
				{
					var o = array[i];
					if (!o.draggable) continue;
				
					if (o.drag(point))
					{
						this.hoverObject = o;
						this.clickedObject = o;
						break;
					}
				}
			}
		}		
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
	
	if (input.key("X") && this.clickedObject != null && this.clickedObject.removable == true && this.mousePointSaved != null)
	{
		input.keys["X"] = false;
		this.clickedObject.remove(this.mousePointSaved);
	}
	
	if (input.key("N") && this.clickedObject != null && this.clickedObject.insertable == true)
	{
		input.keys["N"] = false;
		this.clickedObject.insert();
	}
	
	if (input.key("SPACE") && this.clickedObject != null && this.clickedObject.toggleable == true)
	{
		input.keys["SPACE"] = false;
		this.clickedObject.toggle();
	}
}

GameLogic.prototype.update = function(dt)
{
	this.processMouse();
	this.processKeys(dt);
	this.model.process(dt);
}

GameLogic.prototype.mouseMove = function(point)
{
	this.mousePoint = point;
	this.mousePointSaved = point;
}

GameLogic.prototype.mouseChange = function(down)
{
	this.mouseDown = down;
	this.mousePoint = this.mousePointSaved;
}

GameLogic.prototype.spawn = function(type)
{
	switch (type)
	{
		case "invertor":
			var target = new RedModule();
			target.data.invertor = true;
			var id = this.model.putPart("redModule", target);
			var rmd1 = new RedModuleDrawer(this.model, id, target, this.getNewId());
			game.scene.add(rmd1);
			game.scene.markDirtyAll();
			break;
			
		case "redModule":
			var target = new RedModule();
			target.data.invertor = false;
			var id = this.model.putPart("redModule", target);
			var rmd1 = new RedModuleDrawer(this.model, id, target, this.getNewId());
			game.scene.add(rmd1);
			game.scene.markDirtyAll();
			break;
			
		default:
			throw new Error("Undefined type for spawn: " + type);
			break;
	}
}