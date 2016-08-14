function Scene()
{
	this.objects = new Iterator("id");
	this.dirtyIDs = [];
	this.allDirty = false;
}

Scene.prototype.add = function(gameObject)
{
	this.objects.add(gameObject);
	gameObject.scene = this;
	gameObject.addedToScene();
}

Scene.prototype.markDirtyAll = function()
{
	if (this.allDirty)
		return;
	
	this.allDirty = true;
	
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
	for (var i = 0; i < this.dirtyIDs.length; i++)
	{
		if (this.dirtyIDs[i] == gameObject.id)
			return;
	}
	
	this.dirtyIDs.push(gameObject.id);
}

Scene.prototype.getIntersect = function(point)
{	
	var res = [];
	var objects = this.objects;
	
	var i = objects.reset();
	while(i != null)
	{
		var o = objects.get(i.id);
		if (o.intersectable)
		{
			if (o.isIntersect(point))
			{
				res.push(o);
				
				if (!o.hover)
				{
					o.hover = true;
					o.markDirty();
				}
			}
			else
			{
				if (o.hover)
				{
					o.hover = false;
					o.markDirty();
				}
			}
		}
		i = objects.next();
	}
	
	return res;
}

Scene.prototype.destroy = function(object)
{
	this.objects.remove(object.id, true);
}