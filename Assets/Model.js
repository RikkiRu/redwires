function Model()
{
	var data =  { };
	data.name = "Unknown model";
	data.description = "";
	data.idCounter = 0;
	data.table = null; // Таблица истиности
	this.data = data;
	
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

Model.prototype.getNewId = function()
{
	this.idCounter++;
	return this.idCounter;
}

Model.prototype.putPart = function(type, target)
{
	this.parts[this.getNewId()] = {type: type, target: target};
}

Model.prototype.process = function()
{
	
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