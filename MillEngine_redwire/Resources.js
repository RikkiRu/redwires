function Resources()
{
	this.soundEnabled = true;
	this.textures = {};
	this.sounds = {};
}

Resources.prototype =
{
	pathRoot: "Resources/",
	pathTextures: "Textures/",
	pathSounds: "Sounds/",
	extensionTextures: ".png",
	extensionSounds: ".mp3",
	
	load: function(textures, callback)
	{
		this.loadTextures(textures, callback);
	},

	loadTexture: function(name, extension, callback)
	{
		if(extension == null)
			extension = this.extensionTextures;
	
		var image = new Image();
		
		image.onload = callback;
		image.src = this.pathRoot + this.pathTextures + name + extension;
		this.textures[name] = image;
	},
	
	loadTextures: function(textures, callback)
	{
		var loadedCount = 0;
	
		for(var i = 0; i < textures.length; i++)
		{
			this.loadTexture(textures[i], null, function()
			{
				loadedCount++;
				if (loadedCount == textures.length)
					callback();
			});
		}
	},
	
	// ------------------------------------------------------------------
	
	getTexture: function(name)
	{
		if (this.textures[name] == null)
		{
			console.warn("Texture not found! " + name);
			return null;
		}
		
		return this.textures[name];
	},
	
	// TODO: Release gathling method
	
	playSound: function(name)
	{
		var extension = this.extensionSounds;
		var audio = new Audio(this.pathRoot + this.pathSounds + name + extension);
		audio.play();
	}
}