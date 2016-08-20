function Model()
{
	var data =  { };
	data.name = "Unknown model";
	data.description = "No description";
	data.idCounter = 0;
	data.timeOut = 50;
	data.time = data.timeOut + 1;
	this.data = data;
	
	this.parts = {}; 	// Special serialization
	this.events = [];
}

Model.prototype.toJson = function()
{
	var serialized = {};
	serialized.data = this.data;
	var parts = [];
	for (var i in this.parts)
	{
		var p = this.parts[i];
		parts.push(p.data);
	}

	serialized.parts = parts;
	return JSON.stringify(serialized);
}

Model.prototype.convertModule = function(raw)
{
	var p = raw;
	var np = new RedModule();
	np.data = p;
	np.model = this;
	
	var inputsRaw = np.data.inputs.array;
	var outputsRaw = np.data.outputs.array;
	np.data.inputs = new ArrayExtended();
	np.data.outputs = new ArrayExtended();
	np.data.inputs.array = inputsRaw;
	np.data.outputs.array = outputsRaw;
	
	for (var j=0; j<np.data.points.length; j++)
	{
		var pointRaw = np.data.points[j];
		np.data.points[j] = new Point(pointRaw.x, pointRaw.y);
	}
	
	return np;
}

Model.prototype.fromJson = function(json)
{
	var deserialized = JSON.parse(json);
	this.data = deserialized.data;
	this.parts = {};
	
	for (var i in deserialized.parts)
	{
		var p = deserialized.parts[i];
		var np = this.convertModule(p);
		this.parts[np.data.id] = np;
	}
}

Model.prototype.append = function(deserialized)
{
	this.data.idCounter++;
	var idOffset = this.data.idCounter;
	console.log("id offset " + idOffset);
	var centerOffset = game.render.camera.clone();
	
	var added = [];
	
	var maxId = -1;
	
	for (var i in deserialized.parts)
	{
		var p = deserialized.parts[i];
		
		var np = this.convertModule(p);
		
		np.data.id += idOffset;
		
		if (np.data.id > maxId)
			maxId = np.data.id;
		
		for (var j=0; j<np.data.points.length; j++)
		{
			np.data.points[j] = np.data.points[j].diff(centerOffset);
		}
		
		for (var j=0; j<np.data.inputs.array.length; j++)
		{
			np.data.inputs.array[j] += idOffset;
		}
		
		for (var j=0; j<np.data.outputs.array.length; j++)
		{
			np.data.outputs.array[j] += idOffset;
		}
		
		this.parts[np.data.id] = np;
		added.push(np);
	}
	
	this.data.idCounter = maxId;
	
	return added;
}

Model.prototype.registerEvent = function(event)
{
	this.events.push(event);
}

Model.prototype.process = function(dt)
{
	if (this.events.length < 1)
		return;
	
	this.data.time += dt;
	
	if (this.data.time > this.data.timeOut)
	{
		this.data.time = 0;
		
		var event = this.events[0];
		this.events.splice(0, 1);
		this.passEvent(event);
		
		if (this.events.length < 1)
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
			var output = this.parts[outputId];
			
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
		var input = this.parts[inputId];
		
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
	this.parts[id] = target;
}

Model.prototype.putConnection = function (idFrom, idTo)
{
	if (idFrom == idTo)
		return;
	
	var from = this.parts[idFrom];
	var to = this.parts[idTo];
	
	from.data.outputs.put(idTo);
	to.data.inputs.put(idFrom);
	
	this.registerEvent(to);
}

Model.prototype.removeConnection = function (idFrom, idTo)
{	
	var from = this.parts[idFrom];
	var to = this.parts[idTo];
	
	from.data.outputs.remove(idTo);
	to.data.inputs.remove(idFrom);
	this.registerEvent(to);
}

Model.prototype.removePart = function(id)
{
	var removing = this.parts[id];
	
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
	
	delete this.parts[id];
}