function Scene()
{
	this.objects = new Iterator("id");
	this.dirtyIDs = [];
	this.allDirty = false;
	
	this.mousePoint = null; 		// process move
	this.mousePointSaved = null; 	// process click
	this.mouseDown = false;			
}

Scene.prototype.add = function(gameObject)
{
	this.objects.add(gameObject);
	gameObject.scene = this;
	gameObject.addedToScene();
	this.allDirty = false;
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
	if( this.dirtyIDs.indexOf(gameObject.id) != -1)
		return;
	
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

Scene.prototype.update = function(dt)
{
	this.processMouse();
}

Scene.prototype.processMouse = function()
{
	if (this.mousePoint != null)
	{
		var point = this.mousePoint;
		this.mousePoint = null;
		var array = this.getIntersect(point);
		
		if (this.hoverObject != null)
		{
			if (!this.mouseDown)
			{
				this.hoverObject.dragEnd(array);
				this.hoverObject = null;
			}
			else
				this.hoverObject.drag(point);
		}
		else
		{
			if (this.mouseDown)
			{
				for (var i=0; i<array.length; i++)
				{
					var o = array[i];
					if (!o.draggable) continue;
				
					if (o.drag(point))
					{
						this.hoverObject = o;
						this.clickedObject = o;
						break;
					}
				}
			}
		}		
	}
}

Scene.prototype.mouseMove = function(point)
{
	this.mousePoint = point;
	this.mousePointSaved = point;
}

Scene.prototype.mouseChange = function(down)
{
	this.mouseDown = down;
	this.mousePoint = this.mousePointSaved;
}

Scene.prototype.destroy = function(object)
{
	this.objects.remove(object.id, true);
}

Scene.prototype.destroyAll = function()
{
	this.markDirtyAll();
	
	var objects = this.objects;
	
	var i = objects.reset();
	while(i != null)
	{
		var o = objects.get(i.id);
		o.destroy();
		i = objects.next();
	}
}