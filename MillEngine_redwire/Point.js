function Point(x, y)
{
	this.x = x;
	this.y = y;
}

Point.prototype.center = function(point)
{
	var cx = (this.x + point.x) / 2;
	var cy = (this.y + point.y) / 2;
	return new Point(cx, cy);
}