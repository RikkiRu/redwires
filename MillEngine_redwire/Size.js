function Size(w, h, calculate_half)
{
	this.w = w;
	this.h = h;
	
	if (calculate_half == true)
	{
		this.w2 = w / 2;
		this.h2 = h / 2;
		
		var offset = 1;
		var offset2 = offset * 2;
		
		this.w2_offset = this.w2 + offset;
		this.h2_offset = this.h2 + offset;
		this.w_offset = this.w + offset2;
		this.h_offset = this.h + offset2;
	}
}