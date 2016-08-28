function GameLogic()
{
	this.cameraSpeed = 1;
	this.counter = 0;
	this.colorPresets = new ColorPresets();

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
	
	var o1 = new GO_dragable(this.getNewId());
	o1.point = new Point(150, 300);
	game.scene.add(o1);
	var o2 = new GO_dragable(this.getNewId());
	o2.point = new Point(300, 300);
	game.scene.add(o2);
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
	
	var clickedObject = game.scene.clickedObject;
	var mousePointSaved = game.scene.mousePointSaved;
	
	if (input.key("X") && clickedObject != null && clickedObject.removable == true && mousePointSaved != null)
	{
		input.keys["X"] = false;
		clickedObject.remove(mousePointSaved);
	}
	
	if (input.key("N") && clickedObject != null && clickedObject.insertable == true)
	{
		input.keys["N"] = false;
		clickedObject.insert();
	}
	
	if (input.key("SPACE") && clickedObject != null && clickedObject.toggleable == true)
	{
		input.keys["SPACE"] = false;
		clickedObject.toggle();
	}
}

GameLogic.prototype.update = function(dt)
{
	this.processKeys(dt);
	this.model.process(dt);
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