function RedModule()
{
	var data = {};
	
	// data.id should be set in Model
	data.points = [];
	data.colorPreset = 0;
	data.invertor = true;
	data.active = false;
	data.userState = false;
	
	var p1 = game.render.getScreenCenter();
	var p2 = game.render.getScreenCenter(); p2.x += 50;

	data.points.push(p1);	
	data.points.push(p2);
	
	data.inputs = new ArrayExtended();
	data.outputs = new ArrayExtended();
	
	this.data = data;
}

RedModule.prototype.toggle = function()
{
	this.data.userState = !this.data.active;	
	this.model.registerEvent(this);
}