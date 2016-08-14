function RedModule()
{
	var data = {};
	data.points = [];
	data.colorPreset = 0;
	data.invertor = true;
	
	data.points.push(new Point(0, 0));
	data.points.push(new Point(50, 20));
	data.points.push(new Point(70, 40));
	data.points.push(new Point(100, 20));
	
	this.data = data;
	this.init();
}

RedModule.prototype.init = function()
{
	this.active = false;
}

RedModule.prototype.toJson = function()
{
	return JSON.stringify(this.data);
}

RedModule.prototype.fromJson = function(json)
{
	this.data = JSON.parse(json);
	this.init();
}