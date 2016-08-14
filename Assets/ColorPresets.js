function ColorPresets()
{
	this.colors = {};
}

ColorPresets.prototype.get = function(id, active)
{
	if (this.colors[id] == null)
		this.colors[id] = this.generate();
	
	return active ? this.colors[id].active : this.colors[id].inactive;
}

ColorPresets.prototype.generate = function()
{
	var colorPreset = { active: "#FF0000", inactive: "#4C0000" };
	return colorPreset;
}