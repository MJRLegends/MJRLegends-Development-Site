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
	textOffsetY: 0
};

//The canvas and its drawing surface
var canvas = document.getElementById('falldown');
var drawingSurface = canvas.getContext('2d');

var sprites = []; //An array to store the sprites
var menuButtons = []; //An array to store the main menu buttons
var settingsButtons = []; //An array to store the settings menu buttons
var pausedButtons = []; //An array to store the pasued menu buttons

//Load the image
var image = new Image();
image.addEventListener("load", gameMain, false);
image.src = "images/falldown/spritesheet.png";

//Arrow key codes
var RIGHT = 39;
var LEFT = 37;
var ESC = 27;

//Directions
var moveRight = false;
var moveLeft = false;
var pressedESC = false;
var paused = false;
var gameStarted = false;

//Variables are set to actual values when the game is Started/Reset
var playerspeed = 0; // Used for player speed
var yLevel = 0; // Used saving the Current y level when rendering the lines/platforms
var ySpacing = 0; // Used for the spacing between each lines/platforms
var scrollingSpeed = 0; // Used for the speed that the scrolling effect happens and the lines/platforms move up
var spawned = false; // Used to check if the lines/platforms have been spawned
var gameStart = false; // Used to check if game has been started
var player; // Used to store the player sprite object
var score = 0; // Used for the score
var lineTick = 0; // Used to store the number for calculating score
var tick = 0; // Used to count up for the increasing of the scrolling and player
var highestscore = 0; // Used store the players highest score
var currentScreen = "mainMenu"; // Used store the current screen
var currentDifficulty = "medium"; // Used store the current difficulty 

//Event listeners
window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case LEFT:
            moveLeft = true;
            break;
        case RIGHT:
            moveRight = true;
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
        case LEFT:
            moveLeft = false;
            break;

        case RIGHT:
            moveRight = false;
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
			else if(y >= buttonTempY + 100 && y <= (buttonTempY + 60) + 100)
				currentScreen = "settings";
	}
	else if(currentScreen == "settings"){ // Settings Menu inputs
		if(x >= buttonTempX && x <= (buttonTempX + 200)){
			if(y >= buttonTempY && y <= (buttonTempY + 60)){
				currentDifficulty = "easy";
			}
			else if(y >= buttonTempY  + 100 && y <= (buttonTempY + 60) + 100){
				currentDifficulty = "medium";
			}
			else if(y >= buttonTempY + 200 && y <= (buttonTempY + 60) + 200){
				currentDifficulty = "hard";
			}
			else if(y >= buttonTempY + 300 && y <= (buttonTempY + 60) + 300){
				currentScreen = "mainMenu";
			}
		}
	}
	else if(currentScreen == "game" && paused){ // Paused Menu inputs
		if(x >= buttonTempX && x <= (buttonTempX + 200))
			if(y >= buttonTempY && y <= (buttonTempY + 60)){
				currentScreen = "mainMenu";
				pressedESC = false;
				gameStarted = false;
				paused = false;
			}
	}
}, false);

function getMousePos(canvas, evt){ // Gets the mouse coords from the canva
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
	
	//Creates the Settings button
	tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 300;
	tempbutton.text = "Settings";
	tempbutton.textOffsetX = 45;
	tempbutton.textOffsetY = 35;
	menuButtons.push(tempbutton);
	
	//Creates the difficulty buttons (easy,medium,hard)
	
	//Easy
	tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 200;
	tempbutton.text = "Easy";
	tempbutton.textOffsetX = 70;
	tempbutton.textOffsetY = 38;
	settingsButtons.push(tempbutton);
	
	//Medium
	tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 300;
	tempbutton.text = "Medium";
	tempbutton.textOffsetX = 50;
	tempbutton.textOffsetY = 38;
	settingsButtons.push(tempbutton);
	
	//Hard
	tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 400;
	tempbutton.text = "Hard";
	tempbutton.textOffsetX = 70;
	tempbutton.textOffsetY = 38;
	settingsButtons.push(tempbutton);
	
	//Creates the Back to menu buttons for settings menu
	tempbutton = Object.create(buttonObject);
	tempbutton.x = (canvas.width / 2) - 100;
	tempbutton.y = 500;
	tempbutton.text = "Back to menu";
	tempbutton.textOffsetX = 15;
	tempbutton.textOffsetY = 38;
	settingsButtons.push(tempbutton);
	
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
			if (gameStart == false) { // Starts/Resets the game
				playerspeed = 12;
				yLevel = 350;
				ySpacing = 55;
				scrollingSpeed =  1.5;
				spawned = false;
				gameStart = true;
				sprites = []; // Clears the sprite array
				lineTick = 1;
				score = 0;
				tick = 0;
				//Create the player
				player = Object.create(spriteObject);
				player.sourceX = 64;
				player.x = canvas.width;
				player.y = 15;
				player.width = 32;
				player.height = 32;
				sprites.push(player);
			} else {
				//Used to increase the speed of scrolling and player depending on the difficulty
				tick++;
				if (tick == 75) {
					switch(currentDifficulty){
						case "easy":
							scrollingSpeed = scrollingSpeed + 0.005;
							playerspeed = playerspeed + 0.0045;
							break;
						
						case "medium":
							scrollingSpeed = scrollingSpeed + 0.01;
							playerspeed = playerspeed + 0.0055;
							break;
						
						case "hard":
							scrollingSpeed = scrollingSpeed + 0.05;
							playerspeed = playerspeed + 0.0065;
							break;
					}
					tick = 0; // Resets the tick variable
				}
				//Makes the scrolling happen
				for (var i = 1; i < sprites.length; i++) {
					sprites[i].y = sprites[i].y - scrollingSpeed;
				}
				//Checks if the lines/platforms have been spawned
				if (!spawned) {
					spawnPlatforms();
					spawned = true;
				}
				else {
					//Adds 2 score to the score system when passing a platform
					if (player.y > sprites[lineTick].y && player.y < (sprites[lineTick + 2].y)) {
						score++;
						lineTick+=2;
					}

					// Makes the player fall down/have physics 
					if ((player.y + player.height) < canvas.height)
						player.y = player.y + 6.5;

					//Player movement

					//Left movement
					if (moveLeft && !moveRight) {
						player.vx = -playerspeed;
					}
					//Right movement
					if (moveRight && !moveLeft) {
						player.vx = playerspeed;
					}

					//Move the player
					player.x += player.vx;
					player.y += player.vy;

					//Collision detection for the player on the platforms
					for (var i = 1; i < sprites.length; i++) {
						blockRectangle(player, sprites[i]);
					}

					//Collision detection to make sure the player cant go off the canvas
					if (player.x < 0)
						player.x = 0;

					if (player.y < 0) { // If the player hits the top/ Game Over!
						player.y = 0;
						gameStart = false; // Makes the game reset
						if (highestscore < score)
							highestscore = score;
					}
					if (player.x + player.width > canvas.width)
						player.x = canvas.width - player.width;
					if (player.y + player.height > canvas.height)
						player.y = canvas.height - player.height;

				}
			}
		}
	}
	render(); //Render the screen
}

function spawnPlatforms(){
	for (var i = 0; i < 1000; i++) {
		//Makes the left side of the platforms at a random length
		sprites.push(Object.create(spriteObject));
		sprites[sprites.length - 1].y = yLevel + ySpacing; // Adds the previous y and spacing to the y
		sprites[sprites.length - 1].height = 10;
		sprites[sprites.length - 1].width = Math.floor((Math.random() * (canvas.width - 45)) + 2); // Creates a random length platforms
		
		//Changing the colours of certain lines
		if(i > 50 && i < 100)
			sprites[sprites.length - 1].sourceX = 192;
		else if(i >= 100 && i < 200)
			sprites[sprites.length - 1].sourceX = 256;
		else if(i >= 200)
			sprites[sprites.length - 1].sourceX = 320;
		else 
			sprites[sprites.length - 1].sourceX = 128;
		
		sprites.push(Object.create(spriteObject));
		sprites[sprites.length - 1].y = yLevel + ySpacing; // Adds the previous y and spacing to the y
		sprites[sprites.length - 1].height = 10;

		var spaceLeft = canvas.width - sprites[sprites.length - 2].width; // Gets the remaining space from the random length platforms from the left to the right edge
		var holeSpacing = (Math.random() * (canvas.width - 600)) + 45; // Creates a random amount of hole spacing for the player to pass through

		spaceLeft = spaceLeft - holeSpacing; // Calculating the remaining space from the random length platforms from the left to the right edge 
		sprites[sprites.length - 1].width = spaceLeft;
		sprites[sprites.length - 1].x = canvas.width - spaceLeft;
		 
		//Changing the colours of certain lines
		if(i > 50 && i < 100)
			sprites[sprites.length - 1].sourceX = 192;
		else if(i >= 100 && i < 200)
			sprites[sprites.length - 1].sourceX = 256;
		else if(i >= 200)
			sprites[sprites.length - 1].sourceX = 320;
		else 
			sprites[sprites.length - 1].sourceX = 128;
		
		yLevel += ySpacing; // Adds the y value to use for the next platform creation
	}
}

function blockRectangle(r1, r2) {
    //A variable to tell us which side the collision is occurring on
    var collisionSide = "";

    //Calculate the distance vector
    var vx = r1.centerX() - r2.centerX();
    var vy = r1.centerY() - r2.centerY();

    //Figure out the combined half-widths and half-heights
    var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
    var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

    //Check whether vx is less than the combined half-widths 
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occurring! 
        //Check whether vy is less than the combined half-heights 
        if (Math.abs(vy) < combinedHalfHeights) {
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

function render() {
	//Clears the screen
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
	if (sprites.length !== 0) {
		//Render each sprite in the array
		drawingSurface.shadowOffsetX = 0;
		drawingSurface.shadowOffsetY = 0;
		drawingSurface.shadowBlur = 0;
		drawingSurface.shadowColor="#000000";
		for (var i = 0; i < sprites.length; i++) {
			var sprite = sprites[i];
			//Draws image to the canvas
			drawingSurface.drawImage(
				image,
				sprite.sourceX, sprite.sourceY,
				sprite.sourceWidth, sprite.sourceHeight,
				Math.floor(sprite.x), Math.floor(sprite.y),
				sprite.width, sprite.height
			);
		}
		
		//Renders game based text to the canvas
		drawingSurface.fillStyle = "#54A4FF";
		drawingSurface.shadowOffsetX = 1;
		drawingSurface.shadowOffsetY = 1;
		drawingSurface.shadowBlur = 2;
		drawingSurface.shadowColor="#FFFFFF";
		drawingSurface.font = "25px Verdana";
		drawingSurface.fillText("Score : " + score, 15, 25);
		drawingSurface.fillText("Highest Score : " + highestscore, 220, 25);
		drawingSurface.fillText("FPS : " + fps.getFPS(), 700, 25);
		//drawingSurface.fillText("Scrolling Speed: " + scrollingSpeed, 220, 75);
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
	else if(currentScreen == "settings")
		settings();
}

function mainMenu(){ // Render method for the main menu
	//Renders the background image for the main menu
	var image = new Image();
	image.src= "images/falldown/menuBackground.png";
	image.blur = true;
	drawingSurface.drawImage(image,0,0,canvas.width,canvas.height);
	
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
	drawingSurface.font = "100px Verdana";
	drawingSurface.fillStyle = gradient;
	drawingSurface.fillText("Falldown!", (canvas.width / 2) - 225, 150);

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

function settings(){ // Render method for the settings menu
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
	drawingSurface.font = "100px Verdana";
	drawingSurface.fillStyle = gradient;
	drawingSurface.fillText("Settings!", (canvas.width / 2) - 220, 150);

	//Renders buttons to the canvas
	for(var i = 0; i < settingsButtons.length; i++){
		//Render the button
		drawingSurface.shadowOffsetX = 2;
		drawingSurface.shadowOffsetY = 2;
		drawingSurface.shadowBlur = 5;
		drawingSurface.shadowColor="#000000";
		
		gradient = drawingSurface.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop("0", "magenta");
		gradient.addColorStop("0.5", "blue");
		gradient.addColorStop("1.0", "red");
		drawingSurface.fillStyle = gradient;
		drawingSurface.fillRect(settingsButtons[i].x, settingsButtons[i].y, 200,60);
		
		//Render the button's text
		drawingSurface.font = "25px Verdana";
		if(i < settingsButtons.length){
			if(settingsButtons[i].text.toLowerCase() == currentDifficulty)
				drawingSurface.fillStyle = "#000000";
			else
				drawingSurface.fillStyle = "#FFFFFF";
		}
		else
			drawingSurface.fillStyle = "#FFFFFF";
		drawingSurface.fillText(settingsButtons[i].text, settingsButtons[i].x + settingsButtons[i].textOffsetX,  settingsButtons[i].y + settingsButtons[i].textOffsetY);
	}
}

var fps = {
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