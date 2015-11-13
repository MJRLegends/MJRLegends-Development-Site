//Sprite object
var spriteObject = {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 64,
    sourceHeight: 64,
    width: 64,
    height: 64,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
	value: 0,
	
	lastDirection: "",
	lastx : 0,
	lasty : 0,
	moveTimer: 0,
	moveTime: 0,
	isDead: false,
	reSpawnDelayTimer: 0,
	
	//Getters
    centerX: function() {
        return this.x + (this.width / 2);
    },
    centerY: function() {
        return this.y + (this.height / 2);
    },
    halfWidth: function() {
        return this.width / 2;
    },
    halfHeight: function() {
        return this.height / 2;
    },
	isMoving : function(){
		var tempX;
		var tempY;
		if(this.x < this.lastx)
			tempX = this.lastx - this.x;
		else 
			tempX = this.x - this.lastx;
			
		if(this.y < this.lasty)
			tempY = this.lasty - this.y;
		else 
			tempY = this.y - this.lasty;
		if(tempX > 0.5){
			this.lastx = this.x;
			return true;
		}
		else if(tempY > 0.5)
		{
			this.lasty = this.y;
			return true;
		}
		else
		return false;
	}	
};

//Button object
var buttonObject = {
    width: 64,
    height: 64,
    x: 0,
    y: 0,
	text: "",
	textOffsetX: 0,
	textOffsetY: 0,
};

//Map Layout 0: Blank space, 1: Wall, 2: Small white dot, 3: Big white dot, 4: Spawn Box Door
var mapGrid = 
[								//M
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0,
	0, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 0,
	0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0,
	0, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 0,
	0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0,
	0, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
	1, 1, 1, 1, 1, 2, 1, 0, 1, 4, 4, 4, 1, 0, 1, 2, 1, 1, 1, 1, 1,
	2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2,
	1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1,
	0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 0,
	0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0,
	0, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 0,
	0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 2, 1, 0,
	0, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 0,
	0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 0,
	0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0,
	0, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0
];

//The canvas and its drawing surface
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

var sprites = []; //An array to store the sprites
var map = []; //An array to store the sprites
var menuButtons = []; //An array to store the main menu buttons
var pausedButtons = []; //An array to store the pasued menu buttons

//Load the image
var image = new Image();
image.addEventListener("load", gameMain, false);
image.src = "images/spritesheet.png";

//Button key codes
var UP = 87;
var DOWN = 83;
var RIGHT = 68;
var LEFT = 65;
var ESC = 27;

//Directions
var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;
var pressedESC = false;

var paused = false; // Used to check if the game has been pasued
var gameStarted = false; // Used to check if the game has been started

//Variables are set to actual values when the game is Started/Reset
var gameStart = false; // Used to check if game has been started
var player; // Used to store the player sprite object
var score; // Used for the score
var highestscore = 0; // Used store the players highest score
var currentScreen = "mainMenu"; // Used store the current screen
var playerState; // Used to store the player state/direction
var playerAnimationDelay; // Used to store the player Animation Delay
var spriteEatDelay; // Used to store the delay of the enemeies turning blue/eat mode

//Event listeners
window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
		case UP:
			moveUp = true;
			break;
		case DOWN:
			moveDown = true;
			break;
		case RIGHT:
			moveRight = true;
			break;
		case LEFT:
			moveLeft = true;
			break;
		case ESC:
			if(pressedESC)
				pressedESC = false;
			else 
				pressedESC = true;
            break;
    }
}, false);

window.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
		case UP:
			moveUp = false;
			break;
		case DOWN:
			moveDown = false;
			break;
		case RIGHT:
			moveRight = false;
			break;
		case LEFT:
			moveLeft = false;
			break;
    }
}, false);

window.addEventListener("mousedown", function(event) {
	var mousePos = getMousePos(canvas, event);
	var x = mousePos.x;
	var y = mousePos.y;
	var buttonTempX = (canvas.width / 2) - 100;
	var buttonTempY = 200;
	
	if(currentScreen == "mainMenu"){ // Main Menu inputs
		if(x >= buttonTempX && x <= (buttonTempX + 200))
			if(y >= buttonTempY && y <= (buttonTempY + 60)){
				gameStart = false;
				gameStarted = true;
				currentScreen = "game";
			}
	}
	else if(currentScreen == "game" && paused){ // Paused Menu inputs
		if(x >= buttonTempX && x <= (buttonTempX + 200))
			if(y >= buttonTempY && y <= (buttonTempY + 60)){
				currentScreen = "mainMenu";
				pressedESC = false;
				gameStarted = false;
			}
	}
}, false);

function getMousePos(canvas, evt){ // Gets the mouse coords from the canvas
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function gameMain(){ // Main method
	loadButtons();
	update();
}

function loadButtons(){ // Creates the buttons
	//Creates the Start Game button
	var tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 200;
	tempbutton.text = "Start Game";
	tempbutton.textOffsetX = 28;
	tempbutton.textOffsetY = 35;
	menuButtons.push(tempbutton);
	
	//Creates the Back to menu buttons for the pause menu
	tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 200;
	tempbutton.text = "Back to menu";
	tempbutton.textOffsetX = 15;
	tempbutton.textOffsetY = 35;
	pausedButtons.push(tempbutton);	
}

function update(){ // Update Method
	//The animation loop
	requestAnimationFrame(update, canvas);
	
	if(gameStarted){ // Start the game if true
		if(pressedESC)
			paused = true;
		else 
			paused = false;
		if(paused == false){
			if (gameStart == false){ // Starts/Resets the game
				sprites = []; // Clears the sprite array
				score = 0;
				map = [];  // Clears the map array
				gameStart = true;
				paused = false;
				score = 0;
				playerState = 1;
				playerAnimationDelay = 0;
				spriteEatDelay = 0;
				loadSprites();
				loadMap();
			} 
			else {		
				enemySpriteMovement();
				playerSpriteMovement();
				
				//Collision detection for the sprites
				for (var i = 0; i < map.length; i++) {
					if(map[i].value == 1){ // Map Walls
						blockRectangle(player, map[i]);
						for (var j = 1; j < sprites.length; j++) {
							if(sprites[j].isDead == false){
								blockRectangle(sprites[j], map[i]);
							}
						}
					}
					else if (map[i].value == 2){ // Small white dot
						if(player.x <= map[i].x + 6 && player.x >= map[i].x - 6 && player.y <= map[i].y + 6 && player.y >= map[i].y - 6){
							map[i].sourceX = 512;
							map[i].value = 0;
							score++;
						}
					}
					else if (map[i].value == 3){ // Big white dot
						if(player.x <= map[i].x + 6 && player.x >= map[i].x - 6 && player.y <= map[i].y + 6 && player.y >= map[i].y - 6){
							map[i].sourceX = 512;
							map[i].value = 0;
							spriteEatDelay = 0;
							for (var k = 1; k < sprites.length; k++) {
								if(sprites[k].isDead == false){
									sprites[k].sourceX = 256;
								}
							}
						}
					}
					else if (map[i].value == 4){ // Stop the player going into the spawn box
						blockRectangle(player, map[i]);
					}
				}
				
				for (var i = 1; i < sprites.length; i++) {
					if(sprites[i].isDead == false){
						var temp;
						//Checks if a player has eaten a enemeies after getting the big white dots
						if(sprites[i].sourceX == 256){
							temp = blockRectangle(player, sprites[i]);
							if(temp != "none")
								sprites[i].isDead = true;
						}
						
						//Checks if a enemy has eaten the player and reset the game is true
						else{
							temp = blockRectangle(sprites[i], player);
							if(temp != "none"){
								gameStart = false; // Makes the game reset
								if (highestscore < score)
									highestscore = score;
							}
						}
					}
				}
				
				//Applying the enemeies textures back to normal after getting the big white dots			
				spriteEatDelay++;
				if(spriteEatDelay >= 250){
					sprites[1].sourceX = 0;
					sprites[2].sourceX = 64;
					sprites[3].sourceX = 128;
					sprites[4].sourceX = 192;
				}
				
				//Check if map has been compelted so it can reset
				var found = false;
				for (var i = 1; i < map.length; i++) {
					if(map[i].value == 2 || map[i].value == 3)
						found = true;
				}
				if(found == false)
					gameStart = false;
					if (highestscore < score)
						highestscore = score;
					
				//Respawn Enemies
				for (var i = 1; i < sprites.length; i++) {
					if(sprites[i].isDead == true){
						if(sprites[i].reSpawnDelayTimer == 100){
							sprites[i].x = 24 * 10;
							sprites[i].y = 24 * 10;
							sprites[i].width = 24;
							sprites[i].height = 24;
							sprites[i].moveTime = 200;
							sprites[i].moveTimer = 0;
							sprites[i].isDead = false;
						}
						else 
							sprites[i].reSpawnDelayTimer++;
					}
				}
			}
		}
	}
	render(); //Render the screen
}

function loadMap(){ // Generate the map
	var mapX = 0;
	var mapY = 21 * 2;
	var temp;
	for(var i = 0; i < mapGrid.length; i++){
		if(mapGrid[i] == 0){
			temp = Object.create(spriteObject);
			temp.sourceX = 512;
			temp.x = mapX;
			temp.y = mapY;
			temp.width = 24;
			temp.height = 24;
			temp.value = mapGrid[i];
			map.push(temp);
		}			
		else if(mapGrid[i] == 1){
			temp = Object.create(spriteObject);
			temp.sourceX = 128;
			temp.x = mapX;
			temp.y = mapY;
			temp.width = 24;
			temp.height = 24;
			temp.value = mapGrid[i];
			map.push(temp);
		}
		else if(mapGrid[i] == 2){
			temp = Object.create(spriteObject);
			temp.sourceX = 0;
			temp.x = mapX;
			temp.y = mapY;
			temp.width = 24;
			temp.height = 24;
			temp.value = mapGrid[i];
			map.push(temp);
		}
		else if(mapGrid[i] == 3){
			temp = Object.create(spriteObject);
			temp.sourceX = 64;
			temp.x = mapX;
			temp.y = mapY;
			temp.width = 24;
			temp.height = 24;
			temp.value = mapGrid[i];
			map.push(temp);
		}
		else if(mapGrid[i] == 4){
			temp = Object.create(spriteObject);
			temp.sourceX = 320;
			temp.sourceY = 64;
			temp.x = mapX;
			temp.y = mapY;
			temp.width = 24;
			temp.height = 24;
			temp.value = mapGrid[i];
			map.push(temp);
		}
		mapX += 24;
		if(i == 20 || i == 41 || i == 62 || i == 83 || i == 104 || i == 125 || i == 146 || i == 167 || i == 188 || i == 209 || i == 230 || i == 251 || i == 272 || i == 293 || i == 314 || i == 335 || i == 356 || i == 377 || i == 398 || i == 419){
			mapY = mapY + 24;
			mapX = 0;
		}
	}	
}

function loadSprites(){ // Create all of the sprites
	//Create the player
	player = Object.create(spriteObject);
	player.sourceX = 192;
	player.x = 24 * 10;
	player.y = 24 * 17;
	player.width = 24;
	player.height = 24;
	sprites.push(player);

	var tempMob;
	//Create the tempMob 1
	tempMob = Object.create(spriteObject);
	tempMob.sourceX = 0;
	tempMob.sourceY = 64;
	tempMob.x = 24 * 10;
	tempMob.y = 24 * 10;
	tempMob.width = 24;
	tempMob.height = 24;
	tempMob.moveTime = 200;
	sprites.push(tempMob);

	//Create the tempMob 2
	tempMob = Object.create(spriteObject);
	tempMob.sourceX = 64;
	tempMob.sourceY = 64;
	tempMob.x = 24 * 10;
	tempMob.y = 24 * 10;
	tempMob.width = 24;
	tempMob.height = 24;
	tempMob.moveTime = 400;
	sprites.push(tempMob);

	//Create the tempMob 3
	tempMob = Object.create(spriteObject);
	tempMob.sourceX = 128;
	tempMob.sourceY = 64;
	tempMob.x = 24 * 10;
	tempMob.y = 24 * 10;
	tempMob.width = 24;
	tempMob.height = 24;
	tempMob.moveTime = 600;
	sprites.push(tempMob);

	//Create the tempMob 4
	tempMob = Object.create(spriteObject);
	tempMob.sourceX = 192;
	tempMob.sourceY = 64;
	tempMob.x = 24 * 10;
	tempMob.y = 24 * 10;
	tempMob.width = 24;
	tempMob.height = 24;
	tempMob.moveTime = 800;
	sprites.push(tempMob);
}

function playerSpriteMovement(){ // Player Movement
	//Up
	if(moveUp && !moveDown)
	{
		player.vy = -1.5;
		playerAnimationDelay++;
		if(playerAnimationDelay == 10){
			if(playerState == 3)
				playerState = 0;
			else 
				playerState = 3;
			playerAnimationDelay = 0;
		}
	}
	//Down
	if(moveDown && !moveUp)
	{
		player.vy = 1.5;
		playerAnimationDelay++;
		if(playerAnimationDelay == 10){
			if(playerState == 4)
				playerState = 0;
			else 
				playerState = 4;
			playerAnimationDelay = 0;
		}
	}
	//Left
	if(moveLeft && !moveRight)
	{
		player.vx = -1.5;
		playerAnimationDelay++;
		if(playerAnimationDelay == 10){
			if(playerState == 2)
				playerState = 0;
			else 
				playerState = 2;
			playerAnimationDelay = 0;
		}
		if(player.x <= 0 && player.y <= 258)
			player.x = 481;
	}
	//Right
	if(moveRight && !moveLeft)
	{
		player.vx = 1.5;
		playerAnimationDelay++;
		if(playerAnimationDelay == 10){
			if(playerState == 1)
				playerState = 0;
			else 
				playerState = 1;
			playerAnimationDelay = 0;
		}
		if(player.x >= 481 && player.y <= 258)
			player.x = 0;
	}
	
	//Set the player's velocity to zero if none of the keys are being pressed
	if(!moveUp && !moveDown)
	{
		player.vy = 0;
	}
	if(!moveLeft && !moveRight)
	{
		player.vx = 0;
	}

	//Move the player 
	player.x += player.vx;
	player.y += player.vy;
	
	//Stops the player from going off the canvas
	if(player.x < 0)
		player.x = 0;
	if(player.y < 0)
		player.y = 0;
	if(player.x  + player.width > canvas.width)
		player.x = canvas.width - player.width;
	if(player.y  + player.height > canvas.height)
		player.y = canvas.height - player.height;
}

function enemySpriteMovement(){ // Enemy Sprite Movement
	for (var i = 1; i < sprites.length; i++) {
		sprites[i].moveTimer++;
		
		if(sprites[i].moveTimer >= sprites[i].moveTime){
			var mobmapGridX = roundDown(sprites[i].x / 24, 0);
			var mobmapGridY = roundDown(sprites[i].y / 24, 0);
			if(sprites[i].isMoving() == false){
				mobmapGridX--;	
				mobmapGridY--;
				sprites[i].vx = 0;
				sprites[i].vy = 0;
				var indexNumber = ((mobmapGridX* 1) + (mobmapGridY * 21)) + 1;
				
				var LeftType = map[indexNumber - 1].value;
				var RightType = map[indexNumber + 1].value;
				var UpType = map[(indexNumber) - 21].value;
				var DownType = map[(indexNumber ) + 21].value;
				//console.log("Left " + LeftType + "   Right " + RightType + "   Up " + UpType + "   Down " + DownType);

				var random = Math.floor((Math.random() * 4) + 1);
				
				if(LeftType == 1 && random == 1)
					if(RightType != 1)
						random++;
					else if(UpType != 1)
						random+=2;
					else if(DownType != 1)
						random+=3;
					
				else if(RightType == 1 && random == 2)
					if(LeftType != 1)
						random--;
					else if(UpType != 1)
						random++;
					else if(DownType != 1)
						random+=2;
					
				else if(UpType == 1 && random == 3)
					if(RightType != 1)
						random--;
					else if(LeftType != 1)
						random+=-2;
					else if(DownType != 1)
						random++;
					
				else if(DownType == 1 && random == 4)
					if(RightType != 1)
						random+=-2;
					else if(UpType != 1)
						random--;
					else if(LeftType != 1)
						random+=-3;
				
				if(LeftType != 1 && sprites[i].lastDirection != "Left" && sprites[i].lastDirection != "Right" && random == 1){
					sprites[i].lastDirection = "Left";
					sprites[i].vx= -1.5;
				}
				else if(RightType != 1 && sprites[i].lastDirection != "Right" && sprites[i].lastDirection != "Left" && random == 2){
					sprites[i].lastDirection = "Right";
					sprites[i].vx= 1.5;
				}
				else if(UpType != 1 && sprites[i].lastDirection != "Up" && sprites[i].lastDirection != "Down" && random == 3){
					sprites[i].lastDirection = "Up";
					sprites[i].vy= -1.5;
				}
				else if(DownType != 1 && sprites[i].lastDirection != "Down" && sprites[i].lastDirection != "Up" && random == 4){
					sprites[i].lastDirection = "Down";
					sprites[i].vy= 1.5;
				}
			}
		}
	}
		
	for (var i = 1; i < sprites.length; i++) {
		if(sprites[i].isDead == false){
			sprites[i].x += sprites[i].vx;
			sprites[i].y += sprites[i].vy;
		}
	}
}

function roundDown(number, decimals) { // Used in the enemySpriteMovement function
    decimals = decimals || 0;
    return ( Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
}

function blockRectangle(r1, r2) { // Collision detection
    //A variable to tell us which side the collision is occurring on
    var collisionSide = "";

    //Calculate the distance vector
    var vx = r1.centerX() - r2.centerX();
    var vy = r1.centerY() - r2.centerY();

    //Figure out the combined half-widths and half-heights
    var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
    var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

    //Check whether vx is less than the combined half-widths 
    if (Math.abs(vx) <= combinedHalfWidths) {
        //A collision might be occurring! 
        //Check whether vy is less than the combined half-heights 
        if (Math.abs(vy) <= combinedHalfHeights) {
            //A collision has occurred! This is good! 
            //Find out the size of the overlap on both the X and Y axes
            var overlapX = combinedHalfWidths - Math.abs(vx);
            var overlapY = combinedHalfHeights - Math.abs(vy);

            //The collision has occurred on the axis with the
            //*smallest* amount of overlap. Let's figure out which
            //axis that is

            if (overlapX >= overlapY) {
                //The collision is happening on the X axis 
                //But on which side? vy can tell us
                if (vy > 0) {
                    collisionSide = "top";

                    //Move the rectangle out of the collision
                    r1.y = r1.y + overlapY;
                } else {
                    collisionSide = "bottom";

                    //Move the rectangle out of the collision
                    r1.y = r1.y - overlapY;
                }
            } else {
                //The collision is happening on the Y axis 
                //But on which side? vx can tell us
                if (vx > 0) {
                    collisionSide = "left";

                    //Move the rectangle out of the collision
                    r1.x = r1.x + overlapX;
                } else {
                    collisionSide = "right";

                    //Move the rectangle out of the collision
                    r1.x = r1.x - overlapX;
                }
            }
        } else {
            //No collision
            collisionSide = "none";
        }
    } else {
        //No collision
        collisionSide = "none";
    }

    return collisionSide;
}

function render() { // Main Render method
	//Clears the screen
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
	if (sprites.length !== 0) {
		//Render each sprite in the array
		drawingSurface.shadowOffsetX = 0;
		drawingSurface.shadowOffsetY = 0;
		drawingSurface.shadowBlur = 0;
		drawingSurface.shadowColor="#000000";
		for (var i = 0; i < map.length; i++) {
			var mapTemp = map[i];
			//Draws image to the canvas
			drawingSurface.drawImage(
				image,
				mapTemp.sourceX, mapTemp.sourceY,
				mapTemp.sourceWidth, mapTemp.sourceHeight,
				Math.floor(mapTemp.x), Math.floor(mapTemp.y),
				mapTemp.width, mapTemp.height
			);
		}		
		
		for (var i = 0; i < sprites.length; i++) {
			if(sprites[i].isDead == false){
				var sprite = sprites[i];
				//Draws image to the canvas
				
				//Changes the texture to suit the player state/direction
				if(i == 0){
					if(playerState == 0){
						sprite.sourceX = 256;
					}
					else if(playerState == 1){
						sprite.sourceX = 192;
					}
					else if(playerState == 2){
						sprite.sourceX = 320;
					}
					else if(playerState == 3){
						sprite.sourceX = 384;
					}
					else if(playerState == 4){
						sprite.sourceX = 448;
					}
				}
				drawingSurface.drawImage(
					image,
					sprite.sourceX, sprite.sourceY,
					sprite.sourceWidth, sprite.sourceHeight,
					Math.floor(sprite.x), Math.floor(sprite.y),
					sprite.width, sprite.height
				);
			}
		}
		
		//Renders game based text to the canvas
		drawingSurface.fillStyle = "#54A4FF";
		drawingSurface.shadowOffsetX = 1;
		drawingSurface.shadowOffsetY = 1;
		drawingSurface.shadowBlur = 2;
		drawingSurface.shadowColor="#FFFFFF";
		drawingSurface.font = "25px Verdana";
		drawingSurface.fillText("Score : " + score, 15, 25);
		drawingSurface.fillText("Highest Score : " + highestscore, 200, 25);
		drawingSurface.fillText("FPS : " + fps.getFPS(), canvas.width - 150, canvas.height - 25);
		
		//Paused Text/Buttons
		if(paused){
			drawingSurface.font = "35px Verdana";
			drawingSurface.fillStyle = "#FFFFFF";
			drawingSurface.shadowOffsetX = 1;
			drawingSurface.shadowOffsetY = 1;
			drawingSurface.shadowBlur = 2;
			drawingSurface.shadowColor="#000000";
			drawingSurface.fillText("Paused!", (canvas.width / 2) - 72, canvas.height / 2);
			//Renders buttons to the canvas
			for(var i = 0; i < pausedButtons.length; i++){
				//Render the button
				drawingSurface.shadowOffsetX = 2;
				drawingSurface.shadowOffsetY = 2;
				drawingSurface.shadowBlur = 5;
				drawingSurface.shadowColor="#000000";
				
				var gradient = drawingSurface.createLinearGradient(0, 0, canvas.width, 0);
				gradient.addColorStop("0.5", "blue");
				gradient.addColorStop("1.0", "cyan");
				drawingSurface.fillStyle = gradient;
				drawingSurface.fillRect(pausedButtons[i].x, pausedButtons[i].y, 200,60);
				
				//Render the button's text
				drawingSurface.font = "25px Verdana";
				drawingSurface.fillStyle = "#FFFFFF";
				drawingSurface.fillText(pausedButtons[i].text, pausedButtons[i].x + pausedButtons[i].textOffsetX,  pausedButtons[i].y + pausedButtons[i].textOffsetY);
			}
		}
	}
	if(gameStarted == false && currentScreen == "mainMenu")
		mainMenu();
}

function mainMenu(){ // Render method for the main menu
	//Clears the screen
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
	//Renders menu title to the canvas
	var gradient = drawingSurface.createLinearGradient(0, 0, canvas.width, 0);
	gradient.addColorStop("0", "blue");
	gradient.addColorStop("0.5", "magenta");
	gradient.addColorStop("1.0", "red");
	// Fill with gradient
	drawingSurface.shadowOffsetX = 5;
	drawingSurface.shadowOffsetY = 5;
	drawingSurface.shadowBlur = 5;
	drawingSurface.shadowColor="#FFBAF7";
	drawingSurface.font = "80px Verdana";
	drawingSurface.fillStyle = gradient;
	drawingSurface.fillText("PAC-MAN!", (canvas.width / 2) - 200, 150);

	//Renders buttons to the canvas
	for(var i = 0; i < menuButtons.length; i++){
		//Render the button
		drawingSurface.shadowOffsetX = 2;
		drawingSurface.shadowOffsetY = 2;
		drawingSurface.shadowBlur = 5;
		drawingSurface.shadowColor="#000000";
		
		gradient = drawingSurface.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop("0.5", "blue");
		gradient.addColorStop("1.0", "cyan");
		drawingSurface.fillStyle = gradient;
		drawingSurface.fillRect(menuButtons[i].x, menuButtons[i].y, 200,60);
		
		//Render the button's text
		drawingSurface.font = "25px Verdana";
		drawingSurface.fillStyle = "#FFFFFF";
		drawingSurface.fillText(menuButtons[i].text, menuButtons[i].x + menuButtons[i].textOffsetX,  menuButtons[i].y + menuButtons[i].textOffsetY);
	}
}

var fps = { // FPS counter
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
			currentTime = ( d - this.startTime ) / 1000,
			result = Math.floor( ( this.frameNumber / currentTime ) );

		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
		}
		return result;
	}	
};