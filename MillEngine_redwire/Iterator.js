function Iterator(primaryKey)
{
	this.primaryKey = primaryKey;
	this.storage = {};
	this.head = null;
	this.tail = null;
	this.count = 0;
	
	this.current = null;
}

Iterator.prototype.add = function(o)
{
	var id = o[this.primaryKey];
	
	if (this.storage[id] != null)
		throw new Error("Iterator: already contains object id: " + id);
	
	if (o.iteratorRaw != null)
		throw new Error("Iterator: object contains field 'iteratorRaw', can't add. Id: " + id);
	
	this.storage[id] = o;
	var wasCount = this.count;
	this.count++;
	var element = this.makeElement(this.tail, null, id);
	o.iteratorRaw = { element: element };
	
	if (wasCount == 0)
	{
		this.head = element;
		this.tail = element;
		return;
	}
	
	this.tail.next = element;
	this.tail = element;
}

Iterator.prototype.remove = function(id, exists)
{
	if (this.storage[id] == null)
		if (exists)
			throw new Error("Iterator: not found object id to remove: " + id);
		else
			return;
	
	var o = this.storage[id];
	var element = o.iteratorRaw.element;
	
	delete o.iteratorRaw;
	
	if (element.prev != null)
		element.prev.next = element.next;
	
	if (element.next != null)
		element.next.prev = element.prev;
	
	if (this.tail == element)
		this.tail = element.prev;
	
	if (this.head == element)
		this.head = element.next;
		
	this.count--;
	delete this.storage[id];
}

Iterator.prototype.reset = function()
{
	this.current = this.head;
	return this.current;
}

Iterator.prototype.get = function(id)
{
	return this.storage[id];
}

Iterator.prototype.next = function()
{
	if (this.current != null)
		this.current = this.current.next;
		
	return this.current;
}

Iterator.prototype.makeElement = function(prev, next, id)
{
	return { prev: prev, next: next, id: id };
}

Iterator.prototype.log = function()
{
	var c = this.head;
	var logstr = "";
	while(c != null)
	{
		logstr += c.id.toString() + "; ";
		c = c.next;
	}
	
	logstr+= "||| TOTAL: " + this.count;
	
	console.log(logstr);
}

/*	
	USAGE EXAMPLE
	------------------------------------------------------------------
	var iter = new Iterator("id");
	iter.add({id: 0, name: "o0"});
	iter.remove(6, false);
	var i = iter.reset();
	while(i != null)
	{
		var o = iter.get(i.id);
		console.log(o.name);
		
		i = iter.next();
		Removing current element should be after iter.next();
	}
*/