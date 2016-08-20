function GameLogic()
{
	this.cameraSpeed = 1;
	this.counter = 0;
	this.colorPresets = new ColorPresets();
	this.mousePoint = null;
	this.mousePointSaved = null;
	this.mouseDown = false;
	this.divJsonShowed = false;
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
	this.spawnModel();
	this.updatePanelElements();
}

GameLogic.prototype.spawnModel = function()
{
	for (var i in this.model.parts)
	{
		var part = this.model.parts[i];
		var rmd1 = new RedModuleDrawer(part, this.getNewId());
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
			this.model.putPart(target);
			var rmd1 = new RedModuleDrawer(target, this.getNewId());
			game.scene.add(rmd1);
			game.scene.markDirtyAll();
			break;
			
		case "redModule":
			var target = new RedModule();
			target.data.invertor = false;
			this.model.putPart(target);
			var rmd1 = new RedModuleDrawer(target, this.getNewId());
			game.scene.add(rmd1);
			game.scene.markDirtyAll();
			break;
			
		default:
			throw new Error("Undefined type for spawn: " + type);
			break;
	}
}

GameLogic.prototype.toJson = function()
{
	this.divJsonShowed = !this.divJsonShowed;
	var divJson = document.getElementById("divJson");
	divJson.style.display = this.divJsonShowed ? "block" : "none";
	game.render.paused = this.divJsonShowed;
}

GameLogic.prototype.jsonFromCurrent = function()
{
	var json = "undefined json";
	
	if (this.model.events.length != 0)
	{
		json = "Error: can't serialize model while it's processing events";
	}
	else
	{
		json = this.model.toJson();
	}
	
	var textArea = document.getElementById("textAreaId");
	textArea.value = json;
}

GameLogic.prototype.jsonLoadToCurrent = function()
{
	game.scene.destroyAll();
	var textArea = document.getElementById("textAreaId");
	var json = textArea.value;
	
	this.model.fromJson(json);
	this.spawnModel();
	game.scene.markDirtyAll();
	
	this.toJson();
}

GameLogic.prototype.updatePanelElements = function()
{
	var ls = localStorage["panelElems"];
	if (ls == null)
	{
		var p = [];
		ls = JSON.stringify(p);
		localStorage["panelElems"] = ls;
	}
	
	var panel = document.getElementById("customPanelElements");
	panel.innerHTML = "";
	var lsParsed = JSON.parse(ls);
	
	for (var i=0; i<lsParsed.length; i++)
	{
		var deserialized = JSON.parse(lsParsed[i]);

		var btn = document.createElement("button");
		var name = deserialized.data.name;
		btn.innerHTML = name;
		
		btn.style.cssFloat = "left";
		btn.style.height = "24px";
		btn.style.marginTop = "3px";
		btn.style.marginBottom = "2px";
		btn.style.marginLeft = "5px";
		
		btn.onclick = function() { game.logic.spawnFromPanel(name); };
		panel.appendChild(btn);
	}
}

GameLogic.prototype.spawnFromPanel = function(name)
{
	var ls = localStorage["panelElems"];
	var lsParsed = JSON.parse(ls);
	
	for (var i=0; i<lsParsed.length; i++)
	{
		var deserialized = JSON.parse(lsParsed[i]);
		if (deserialized.data.name == name)
		{
			var added = this.model.append(deserialized);
			
			for (var j=0; j<added.length; j++)
			{
				var part = added[j];
				var rmd1 = new RedModuleDrawer(part, this.getNewId());
				game.scene.add(rmd1);
			}
			
			game.scene.markDirtyAll();		
			return;
		}
	}
	
	throw new Error("Model not found: " + name);
}

GameLogic.prototype.toPanel = function()
{
	var textArea = document.getElementById("textAreaId");
	var json = textArea.value;
	var parsed = JSON.parse(json);
	
	var ls = localStorage["panelElems"];
	var lsParsed = JSON.parse(ls);
	
	for (var i=0; i<lsParsed.length; i++)
	{
		var deserialized = JSON.parse(lsParsed[i]);
		if (deserialized.data.name == parsed.data.name)
		{
			alert("Element «" + deserialized.data.name + "» already exists");
			return;
		}
	}
	
	lsParsed.push(json);
	localStorage["panelElems"] = JSON.stringify(lsParsed);
	
	this.toJson();
	this.updatePanelElements();
}

GameLogic.prototype.deleteFromPanel = function()
{
	var textArea = document.getElementById("textAreaId");
	var name = textArea.value;
	
	var ls = localStorage["panelElems"];
	var lsParsed = JSON.parse(ls);
	
	var indx = -1;
	
	for (var i=0; i<lsParsed.length; i++)
	{
		var deserialized = JSON.parse(lsParsed[i]);
		if (deserialized.data.name == name)
		{
			indx = i;
			break;
		}
	}
	
	if (indx == -1)
	{
		alert("Element «" + name + "» not found in panel");
		return;
	}
	
	lsParsed.splice(indx, 1);
	localStorage["panelElems"] = JSON.stringify(lsParsed);
	this.updatePanelElements();
}