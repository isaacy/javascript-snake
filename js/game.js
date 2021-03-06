'use strict';
// Global variables //
var BLOCK_SIZE = 20;
var COLS = 40;
var ROWS = 30;
var COLOR = ['#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd'];

var snake = [];
var bodyCount = 2;
var foodX = 0;
var foodY = 0;
var grid = 0;
var toGo = 3;

var interval = 0; 
var markCount = 0;
var isPause = false;

var startTime;
var playAgain = false;

var speed = 100; // larger the number, slower is the screen

// Start the game //
window.onload = function () {
    grid = document.getElementById('canvas').getContext('2d');
    document.onkeydown = function (event) {
        var aEvent = event || window.event;
        keydown(aEvent.keyCode);
    }
    
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width  = 800;
    canvas.height = 600;

    $('#gameOverModal').on('hidden.bs.modal', function (e) {
        if (playAgain) {
            snake = [];
            bodyCount = 2;
            toGo = 3;
            start();
        }
    })

    start();
}

// Drawing the canvas and objects //
function draw() {
    // Clear the canvas
    grid.clearRect(0, 0, BLOCK_SIZE * COLS, BLOCK_SIZE * ROWS);

    // Draw the rows
    for (let i = 1; i <= ROWS; i++) {
        grid.beginPath();
        grid.moveTo(0, i * BLOCK_SIZE);
        grid.lineTo(BLOCK_SIZE * COLS, i * BLOCK_SIZE);
        grid.strokeStyle = "whitesmoke";
        grid.stroke();
    }

    // Draw the columns
    for (let i = 1; i <= COLS; i++) {
        grid.beginPath();
        grid.moveTo(i * BLOCK_SIZE, 0);
        grid.lineTo(i * BLOCK_SIZE, BLOCK_SIZE * ROWS);
        grid.stroke();
    }

    // Draw a snack
    for (let i = 0; i < snake.length; i++) {
        grid.beginPath();
        grid.fillStyle = "blue";
        grid.fillRect(snake[i].x, snake[i].y, BLOCK_SIZE, BLOCK_SIZE);
        grid.moveTo(snake[i].x, snake[i].y);
        grid.lineTo(snake[i].x + BLOCK_SIZE, snake[i].y);
        grid.lineTo(snake[i].x + BLOCK_SIZE, snake[i].y + BLOCK_SIZE);
        grid.lineTo(snake[i].x, snake[i].y + BLOCK_SIZE);
        grid.closePath();
        grid.strokeStyle = "white";
        grid.stroke();
    }

    //Draw food
    var colorIndex = Math.floor(Math.random()*COLOR.length);
    grid.beginPath();
    grid.fillStyle = COLOR[colorIndex]; // make the food colorful
    grid.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
    grid.moveTo(foodX, foodY);
    grid.lineTo(foodX + BLOCK_SIZE, foodY);
    grid.lineTo(foodX + BLOCK_SIZE, foodY + BLOCK_SIZE);
    grid.lineTo(foodX, foodY + BLOCK_SIZE);
    grid.closePath();
}

//Begin a game
function start() {
    
    
    markCount = document.getElementById('score');
    markCount.innerHTML = 0;
    playAgain=false;
    for (var i = 0; i < bodyCount; i++) {
        snake[i] = { x: i * BLOCK_SIZE, y: 0 };
    }

    interval = setInterval(move, speed);
    startTime = new Date();
    let timer = document.getElementById('displayMoment');
    timer.innerHTML = moment().diff(startTime);


    
    addFood();  
}
// -------------------- Movement -------------------------//
// Controller //
function move() {
    switch (toGo) {
        case 1:
            snake.push({ x: snake[bodyCount - 1].x - BLOCK_SIZE, y: snake[bodyCount - 1].y });
            break;
        case 2:
            snake.push({ x: snake[bodyCount - 1].x, y: snake[bodyCount - 1].y - BLOCK_SIZE });
            break;
        case 3:
            snake.push({ x: snake[bodyCount - 1].x + BLOCK_SIZE, y: snake[bodyCount - 1].y });
            break;
        case 4:
            snake.push({ x: snake[bodyCount - 1].x, y: snake[bodyCount - 1].y + BLOCK_SIZE });
            break;
        default:

    }
    snake.shift();
    isEat();
    isDie();
    draw();

    let timer = document.getElementById('displayMoment');
    timer.innerHTML = Math.round((moment().diff(startTime))/1000) + " seconds has elapsed.";
}

// Press the button on keyboard //
function keydown(keyCode) {
    switch (keyCode) {
        case 37: // Left
            if (toGo != 1 && toGo != 3) toGo = 1; break;
        case 38: // Up
            if (toGo != 2 && toGo != 4) toGo = 2; break;
        case 39: // Right
            if (toGo != 3 && toGo != 1) toGo = 3; break;
        case 40: // Down
            if (toGo != 4 && toGo != 2) toGo = 4; break;
        case 80: // Start & Pause
            if (isPause) {
                interval = setInterval(move, speed);
                isPause = false;
                document.getElementById('pause').innerHTML = "Pause";
            } else {
                clearInterval(interval);
                isPause = true;
                document.getElementById('pause').innerHTML = "Start";
            }
            break;
    }
}
// Got food, add the point //
function isEat() {
    if (snake[bodyCount - 1].x == foodX && snake[bodyCount - 1].y == foodY) {
        markCount.innerHTML = (parseInt(markCount.innerHTML) + 1).toString();
        addFood();
        addSnake();
    }
}
// Expend the body //
function addSnake() {
    bodyCount++;
    snake.unshift({ x: BLOCK_SIZE * COLS, y: BLOCK_SIZE * ROWS });
}


// Set food location
function addFood() {
    foodX = Math.floor(Math.random() * (COLS - 1)) * BLOCK_SIZE;
    foodY = Math.floor(Math.random() * (ROWS - 1)) * BLOCK_SIZE;
    // console.log(foodX + " -- " + foodY);
}
// Game over
function isDie() {
    if (snake[bodyCount - 1].x == -20 || snake[bodyCount - 1].x == BLOCK_SIZE * COLS
        || snake[bodyCount - 1].y == -20 || snake[bodyCount - 1].y == BLOCK_SIZE * ROWS) {
        //alert("Game Over!");
        clearInterval(interval);
        playAgain = false;
        $('#gameOverModal').modal({
            keyboard: false
        });
    }
    for (var i = 0; i < bodyCount - 1; i++) {
        if (snake[bodyCount - 1].x == snake[i].x && snake[bodyCount - 1].y == snake[i].y) {
            clearInterval(interval);
            playAgain = false;
            $('#gameOverModal').modal({
                keyboard: false
              });
            //alert("Game Over!");
        }
    }
}

function chooseToPlay() {
    playAgain = true;
    $('#gameOverModal').modal('hide');
}

function updateSpeed(value) {
    clearInterval(interval);
    speed = 300 / value;
    interval = setInterval(move, speed);
}
