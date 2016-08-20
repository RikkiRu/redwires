function Model()
{
	var data =  { };
	data.name = "Unknown model";
	data.description = "No description";
	data.idCounter = 0;
	data.connections = {};
	data.timeOut = 50;
	data.time = data.timeOut + 1;
	data.parts = {};
	data.events = [];
	this.data = data;
	
	this.putPart(new RedModule());
}

Model.prototype.registerEvent = function(event)
{
	this.data.events.push(event);
}

Model.prototype.process = function(dt)
{
	if (this.data.events.length < 1)
		return;
	
	this.data.time += dt;
	
	if (this.data.time > this.data.timeOut)
	{
		this.data.time = 0;
		
		var event = this.data.events[0];
		this.data.events.splice(0, 1);
		this.passEvent(event);
		
		if (this.data.events.length < 1)
			this.data.time = this.data.timeOut;
			
		game.scene.markDirtyAll();
	}
}

Model.prototype.passEvent = function(target)
{
	if (this.updateNode(target))
	{
		for (var i=0; i<target.data.outputs.array.length; i++)
		{
			var outputId = target.data.outputs.array[i];
			var output = this.data.parts[outputId];
			
			this.registerEvent(output);
		}
	}
}

Model.prototype.updateNode = function(node)
{
	var inputs = node.data.inputs.array;
	var invertor = node.data.invertor;
		
	if (inputs.length == 0) return this.checkNodeState(node, node.data.userState);
	
	for (var i=0; i<inputs.length; i++)
	{
		var inputId = inputs[i];
		var input = this.data.parts[inputId];
		
		if (input.data.active)
		{
			return this.checkNodeState(node, !invertor);
		}
	}
	return this.checkNodeState(node, invertor);
}

Model.prototype.checkNodeState = function(node, newState)
{
	if (node.data.active)
	{
		if (newState)
			return false;
		
		node.data.active = false;
		return true;
	}
	else
	{
		if (!newState)
			return false;
			
		node.data.active = true;
		return true;
	}
}

Model.prototype.putPart = function(target)
{
	this.data.idCounter++;
	var id = this.data.idCounter;
	target.model = this;
	target.data.id = id;
	target.data.active = target.data.invertor;
	this.data.parts[id] = target;
}

Model.prototype.putConnection = function (idFrom, idTo)
{
	if (idFrom == idTo)
		return;
	
	var from = this.data.parts[idFrom];
	var to = this.data.parts[idTo];
	
	from.data.outputs.put(idTo);
	to.data.inputs.put(idFrom);
	
	this.registerEvent(to);
}

Model.prototype.removeConnection = function (idFrom, idTo)
{	
	var from = this.data.parts[idFrom];
	var to = this.data.parts[idTo];
	
	from.data.outputs.remove(idTo);
	to.data.inputs.remove(idFrom);
	this.registerEvent(to);
}

Model.prototype.removePart = function(id)
{
	var removing = this.data.parts[id];
	
	for (var i=0; i<removing.data.inputs.array.length; i++)
	{
		var idFrom = removing.data.inputs.array[i];
		this.removeConnection(idFrom, removing.data.id);
	}
	
	for (var i=0; i<removing.data.outputs.array.length; i++)
	{
		var idTo = removing.data.outputs.array[i];
		this.removeConnection(removing.data.id, idTo);
	}
	
	delete this.data.parts[id];
}