function Model()
{
	var data =  { };
	data.name = "Unknown model";
	data.description = "";
	data.idCounter = 0;
	data.table = null; // Таблица истиности
	data.connections = {};
	this.data = data;
	this.timeOut = 50;
	this.time = this.timeOut + 1;
	
	this.parts = {};
	this.putPart("redModule", new RedModule());
	
	this.init();
}

Model.prototype.init = function()
{
	this.events = [];
}

Model.prototype.registerEvent = function(event)
{
	this.events.push(event);
}

Model.prototype.process = function(dt)
{
	if (this.events.length < 1)
		return;
		
	this.time += dt;
	if (this.time > this.timeOut)
	{
		this.time = 0;
		
		var event = this.events[0];
		this.events.splice(0, 1);
		
		this.passEvent(event);
		
		if (this.events.length < 1)
			this.time = this.timeOut;
	}
}

Model.prototype.passEvent = function(event)
{
	if (this.updateNode(event.target))
	{
		//console.log("Updated node: " + event.target.id);

		for (var i = 0; i < this.data.connections[event.target.id].length; i++)
		{
			var out = this.parts[this.data.connections[event.target.id][i]].target;
			//console.log("register out: " + out.id);
			this.registerEvent({target: out});
		}
		
		game.scene.markDirtyAll();
	}
}

Model.prototype.updateNode = function(node)
{
	var inputs = [];
	
	for (var i in this.data.connections)
	{
		if (i == node.id) continue;

		for (var j = 0; j<this.data.connections[i].length; j++)
		{
			if (this.data.connections[i][j] == node.id)
			{
				inputs.push(this.parts[i].target);
			}
		}
	}
	
	//console.log("update node " + node.id + "; inputs: " + inputs.length);
	
	if (inputs.length == 0)
	{
		return this.checkNodeState(node, node.userState);
	}
	
	if (node.data.invertor)
	{
		for (var i=0; i<inputs.length; i++)
		{
			var input = inputs[i];
			if (input.active)
			{
				return this.checkNodeState(node, false);
			}
		}
		return this.checkNodeState(node, true);
	}
	else
	{
		for (var i=0; i<inputs.length; i++)
		{
			var input = inputs[i];
			//console.log("input " + input.id + " active " + input.active);
			
			if (input.active)
			{
				return this.checkNodeState(node, true);
			}
		}
		return this.checkNodeState(node, false);
	}
}

Model.prototype.checkNodeState = function(node, newState)
{
	//console.log("check node state: " + node.id + " active now: " + node.active + "; need: " + newState);
	
	if (node.active)
	{
		if (newState)
			return false;
		node.active = false;
			return true;
	}
	else
	{
		if (newState)
		{
			node.active = true;
			return true;
		}
		
		return false;
	}
}

Model.prototype.getNewId = function()
{
	this.data.idCounter++;
	return this.data.idCounter;
}

Model.prototype.putPart = function(type, target)
{
	var id = this.getNewId();
	target.model = this;
	target.id = id;
	target.active = target.data.invertor;
	
	this.parts[id] = {type: type, target: target};
	this.data.connections[id] = [];
	return id;
}

Model.prototype.putConnection = function (idFrom, idTo)
{
	if (idFrom == idTo)
		return;
	
	for (var i = 0; i < this.data.connections[idFrom].length; i++)
	{
		if (this.data.connections[idFrom][i] == idTo)
			return;
	}
	
	this.data.connections[idFrom].push(idTo);
	this.registerEvent({target: this.parts[idTo].target});
}

Model.prototype.removeConnection = function (idFrom, idTo)
{	
	for (var i=0; i<this.data.connections[idFrom].length; i++)
	{
		if (this.data.connections[idFrom][i] == idTo)
		{
			this.data.connections[idFrom].splice(i, 1);
			this.registerEvent({target: this.parts[idTo].target});
			return;
		}
	}
}

Model.prototype.removePart = function(id)
{
	delete this.parts[id];
	
	if (this.data.connections[id] != null) delete this.data.connections[id];
	
	for (var i in this.data.connections)
	{
		for (var j = 0; j<this.data.connections[i].length; j++)
		{
			if (this.data.connections[i][j] == id)
				this.data.connections[i].splice(j, 1);
		}
	}
}

Model.prototype.toJson = function()
{
	return JSON.stringify(this.data);
}

Model.prototype.fromJson = function(json)
{
	this.data = JSON.parse(json);
	this.init();
}