function Scene()
{
	this.objects = new Iterator("id");
	this.dirtyIDs = [];
}

Scene.prototype.add = function(gameObject)
{
	this.objects.add(gameObject);
	gameObject.scene = this;
	gameObject.addedToScene();
}

Scene.prototype.markDirtyAll = function()
{
	var objects = this.objects;
	
	var i = objects.reset();
	while(i != null)
	{
		var o = objects.get(i.id);
		this.markDirty(o);
		i = objects.next();
	}
}

Scene.prototype.markDirty = function(gameObject)
{
	this.dirtyIDs.push(gameObject.id);
}

Scene.prototype.getIntersect = function(point)
{
	var objects = this.objects;
	
	var i = objects.reset();
	while(i != null)
	{
		var o = objects.get(i.id);
		if (o.intersectable && o.isIntersect(point))
		{
			return o;
		}
		i = objects.next();
	}
	
	return null;
}