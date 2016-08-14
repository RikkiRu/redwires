function Model()
{
	var data =  { };
	data.name = "Unknown model";
	data.description = "";
	data.idCounter = 0;
	data.models = {};
	data.table = null; // Таблица истиности
	
	this.data = data;
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