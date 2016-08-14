function RedModuleDrawer(module, id)
{
	GameObject.call(this, id);
	this.module = module;
	this.updateCenter();
	this.intersectable = true;
	this.hover = false;
	this.draggable = true;
}

RedModuleDrawer.prototype = Object.create(GameObject.prototype);
RedModuleDrawer.prototype.constructor = RedModuleDrawer;
RedModuleDrawer.prototype.lineWidth = 4;
RedModuleDrawer.prototype.lineWidth2 = RedModuleDrawer.prototype.lineWidth / 2;
RedModuleDrawer.prototype.lineWidth2x = RedModuleDrawer.prototype.lineWidth * 2;
RedModuleDrawer.prototype.lineWidth4x = RedModuleDrawer.prototype.lineWidth * 4;
RedModuleDrawer.prototype.lineWidth8x = RedModuleDrawer.prototype.lineWidth * 8;
RedModuleDrawer.prototype.lineWidth32x = RedModuleDrawer.prototype.lineWidth * 32;

RedModuleDrawer.prototype.updateCenter = function()
{
	var module = this.module;
	var points = module.data.points;
	
	var minX = points[0].x;
	var maxX = points[0].x;
	var minY = points[0].y;
	var maxY = points[0].y;
	
	for (var i = 0; i < points.length; i++)
	{
		var point = points[i];
		
		if (point.x > maxX) maxX = point.x;
		if (point.x < minX) minX = point.x;
		if (point.y > maxY) maxY = point.y;
		if (point.y < minY) minY = point.y;
	}
	
	var p1 = new Point(minX, minY);
	var p2 = new Point(maxX, maxY);
	this.point = p1.center(p2);
	
	var sx = Math.abs(maxX - minX) + this.lineWidth32x;
	var sy = Math.abs(maxY - minY) + this.lineWidth32x;
	this.size = new Size(sx, sy, true);
}

RedModuleDrawer.prototype.draw = function(ctx)
{	
	var module = this.module;
	var points = module.data.points;
	var invertor = module.data.invertor;
	
	var color = game.logic.colorPresets.get(module.colorPreset, module.active);
	
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = this.lineWidth;
	ctx.moveTo(points[0].x, points[0].y);
	for (var i = 1; i < points.length; i++)
	{
		ctx.lineTo(points[i].x, points[i].y);
	}
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(points[0].x, points[0].y, this.lineWidth2x, 0, game.constants.Math_PI2);
	var last = points[points.length - 1];
	ctx.arc(last.x, last.y, this.lineWidth2x, 0, game.constants.Math_PI2);	
	ctx.fill();
	
	if (invertor)
	{
		ctx.beginPath();
		ctx.fillStyle = "#FFFFFF";
		ctx.arc(points[0].x, points[0].y, this.lineWidth, 0, game.constants.Math_PI2);
		ctx.fill();
	}
	
	if (this.hover)
	{
		ctx.fillStyle = "#0000FF";
		for (var i = 0; i < points.length; i++)
		{
			ctx.beginPath();
			ctx.arc(points[i].x, points[i].y, this.lineWidth, 0, game.constants.Math_PI2);
			ctx.fill();
		}
	}
}

RedModuleDrawer.prototype.drag = function(pointMouse)
{
	if (this.capturedDragPoint != null)
	{
		var point = this.capturedDragPoint;
		point.x = pointMouse.x;
		point.y = pointMouse.y;
		this.updateCenter();
		this.markDirty();
		return;
	}
	
	var module = this.module;
	var points = module.data.points;
	
	for (var i = 0; i < points.length; i++)
	{
		var point = points[i];
		
		if (point.inRadius(pointMouse, this.lineWidth4x))
		{
			this.capturedDragPoint  = point;
			point.x = pointMouse.x;
			point.y = pointMouse.y;
			this.updateCenter();
			this.markDirty();
			return;
		}
	}
}

RedModuleDrawer.prototype.dragEnd = function()
{
	this.capturedDragPoint = null;
}