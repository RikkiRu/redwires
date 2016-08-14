function Rect()
{
	this.p1 = new Point(0, 0);
	this.p2 = new Point(0, 0);
}

Rect.prototype.fromCenterSize = function(point, size)
{
	this.p1 = new Point(point.x - size.w2, point.y - size.h2);
	this.p2 = new Point(point.x + size.w2, point.y + size.h2);
}