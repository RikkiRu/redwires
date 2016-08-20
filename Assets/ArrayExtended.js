function ArrayExtended()
{
	this.array = [];
}

ArrayExtended.prototype.have = function(id)
{
	return this.array.indexOf(id) != -1;
}

ArrayExtended.prototype.put = function(id)
{
	if (this.have(id)) return;
	this.array.push(id);
}

ArrayExtended.prototype.remove = function(id)
{
	var index = this.array.indexOf(id);
	if (index == -1) return;
	this.array.splice(index, 1);
}