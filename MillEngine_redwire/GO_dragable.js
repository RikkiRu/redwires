function GO_dragable(id)
{
	GameObject.call(this, id);
	
	this.intersectable = true;
	this.draggable = true;
	this.dragNow = false;
	this.editable = true;
	this.editNow = false;
	this.editQuadSize = 10;
	this.colorEdit = "red";
	
	this.minSize = 20;
	
	this.size = new Size(100, 100, true);
}

// -----------------
GO_dragable.prototype = Object.create(GameObject.prototype);
GO_dragable.prototype.constructor = GO_dragable;
// -----------------

GO_dragable.prototype.draw = function(ctx)
{
	var needShowEdit = false;
	
	if (this.pointToMove != null)
	{
		this.point = this.pointToMove;
		this.pointToMove = null;
	}
	else if (this.sizeToSet != null)
	{
		this.size = this.sizeToSet;
		this.sizeToSet = null;
		needShowEdit = true;
	}
	
	//GameObject.prototype.draw.call(this, ctx);
	
	ctx.translate(this.point.x, this.point.y);
	
	ctx.beginPath();
	ctx.rect(-this.size.w2, -this.size.h2, this.size.w, this.size.h);
	ctx.fillStyle = "blue";
	ctx.fill();
	
	if (this.hover === true || needShowEdit === true)
	{
		ctx.beginPath();
		ctx.rect(-this.size.w2, -this.size.h2, this.editQuadSize, this.editQuadSize);
		ctx.fillStyle = this.colorEdit;
		ctx.fill();
	}
}

GO_dragable.prototype.checkEditNow = function(pointMouse)
{
	var d1 = new Point(-this.size.w2, -this.size.h2);
	var d2 = new Point(-this.size.w2 + this.editQuadSize, -this.size.h2 + this.editQuadSize);
	
	var editRect = new Rect();
	editRect.p1 = this.point.clone().add(d1);
	editRect.p2 = this.point.clone().add(d2);
	
	this.editNow = pointMouse.inRect(editRect);
}

GO_dragable.prototype.drag = function(pointMouse)
{
	if (this.dragNow === false)
	{
		this.dragNow = true;
		this.checkEditNow(pointMouse);
		return true;
	}
	
	if (this.editNow)
	{
		var diff = this.point.diff(pointMouse);
		var sx = diff.x * 2;
		var sy = diff.y * 2;
		
		if (this.minSize > sx)
			sx = this.minSize;
	
		if (this.minSize > sy)
			sy = this.minSize;
	
		this.sizeToSet = new Size(sx, sy, true);
		game.scene.markDirtyAll();
		return true;
	}
	
	this.pointToMove = pointMouse.clone();
	game.scene.markDirtyAll();
	return true;
}

GO_dragable.prototype.dragEnd = function(array)
{
	this.dragNow = false;
	this.editNow = false;
}