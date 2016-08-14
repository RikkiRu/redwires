function GameObject(id)
{
	this.id = id;
	this.point = new Point(0, 0);
	this.size = new Size(0, 0, true);
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
	//var offs = 5;
	//ctx.beginPath();
	//ctx.rect(-this.size.w2 - offs, -this.size.h2 - offs, this.size.w + offs * 2, this.size.h + offs * 2);
	//ctx.fillStyle = "blue";
	//ctx.fill();
}

GameObject.prototype.draw = function(ctx)
{
	ctx.translate(this.point.x, this.point.y);
	ctx.beginPath();
	ctx.rect(-this.size.w2, -this.size.h2, this.size.w, this.size.h);
	ctx.fillStyle = "red";
	ctx.fill();
}