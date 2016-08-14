function RedModuleDrawer(module, id)
{
	GameObject.call(this, id);
	this.module = module;
	this.updateCenter();
}

RedModuleDrawer.prototype = Object.create(GameObject.prototype);
RedModuleDrawer.prototype.constructor = RedModuleDrawer;
RedModuleDrawer.prototype.lineWidth = 4;

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
	
	var sx = Math.abs(maxX - minX) + this.lineWidth * 4;
	var sy = Math.abs(maxY - minY) + this.lineWidth * 4;
	this.size = new Size(sx, sy, true);
}

RedModuleDrawer.prototype.draw = function(ctx)
{	
	var module = this.module;
	var points = module.data.points;
	
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
	ctx.arc(points[0].x, points[0].y, this.lineWidth * 2, 0, game.constants.Math_PI2);
	ctx.arc(points[points.length - 1].x, points[points.length - 1].y, this.lineWidth * 2, 0, game.constants.Math_PI2);
	ctx.fill();
}