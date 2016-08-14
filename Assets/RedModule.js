function RedModule()
{
	var data = {};
	data.points = [];
	data.colorPreset = 0;
	data.invertor = true;
	
	data.points.push(game.render.getScreenCenter());
	var p2 = game.render.getScreenCenter(); p2.x += 50;
	data.points.push(p2);
	
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

RedModule.prototype.toggle = function()
{
	this.userState = !this.active;	
	this.model.registerEvent({target: this});
}