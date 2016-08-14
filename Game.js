function Game()
{
	this.canvas = document.getElementById("canvasMain");
	this.scene = new Scene();
	this.render = new Render(this.canvas, this.scene);
	this.logic = new GameLogic();
	this.input = new Input(this.canvas, this.render.camera);
}

Game.prototype.start = function()
{
	console.log("Game.start()");
	
	this.logic.start();
	this.input.start();
	this.render.draw();	
}

var game = new Game();