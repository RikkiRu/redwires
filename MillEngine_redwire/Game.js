function Game()
{
	this.canvas = document.getElementById("canvasMain");
	this.scene = new Scene();
	this.render = new Render(this.canvas, this.scene);
	this.logic = new GameLogic();
	this.input = new Input(this.canvas, this.render.camera);
}

Game.prototype.awake = function()
{
	this.resources = new Resources();
	this.resources.load(TexturesList, game.start);
}

Game.prototype.start = function()
{
	console.log("Game.start()");
	game.logic.start();
	game.input.start();
	game.render.draw();	
}

var game = new Game();