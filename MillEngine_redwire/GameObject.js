function GameObject(id)
{
	this.id = id;
	this.point = new Point(0, 0);
	this.size = new Size(0, 0, true);
	this.draggable = false;
	this.removable = false;
}

GameObject.prototype.addedToScene = function()
{
	this.markDirty();
}

GameObject.prototype.markDirty = function()
{
	this.scene.markDirty(this);
}

GameObject.prototype.clear = function(ctx)
{
	ctx.translate(this.point.x, this.point.y);
	var offs = 1;
	ctx.clearRect(-this.size.w2_offset, -this.size.h2_offset, this.size.w_offset, this.size.h_offset);
}

GameObject.prototype.draw = function(ctx)
{
	ctx.translate(this.point.x, this.point.y);
	ctx.beginPath();
	ctx.rect(-this.size.w2, -this.size.h2, this.size.w, this.size.h);
	ctx.fillStyle = "red";
	ctx.fill();
}

GameObject.prototype.checkRect = function()
{
	var needReInit = this.rect == null || !this.rectPoint.equals(this.point) || !this.rectSize.equalsXY(this.size.w, this.size.h);
	
	this.rectPoint = this.point.clone();
	this.rectSize = new Point(this.size.w, this.size.h);
	this.rect = new Rect(); 
	this.rect.fromCenterSize(this.point, this.size);
}

GameObject.prototype.isIntersect = function(point)
{
	this.checkRect();
	return point.x > this.rect.p1.x && point.x < this.rect.p2.x && point.y > this.rect.p1.y && point.y < this.rect.p2.y; 
}

GameObject.prototype.destroy = function()
{
	this.destroyed = true;
	this.markDirty();
}