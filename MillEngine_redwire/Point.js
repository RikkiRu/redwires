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

Point.prototype.equals = function(point)
{
	return this.x == point.x && this.y == point.y;
}

Point.prototype.equalsXY = function(x, y)
{
	return this.x == x && this.y == y;
}

Point.prototype.clone = function()
{
	return new Point(this.x, this.y);
}

Point.prototype.distanceTo = function(point)
{
	return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
}

Point.prototype.inRadius = function(point, radius)
{
	var dist = this.distanceTo(point);
	return dist < radius;
}