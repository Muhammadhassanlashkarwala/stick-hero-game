// Extend the base fuctionality of JavaScript
Array.prototype.last = function () {
    return this[this.length -1];
};

// A Sinus function that acceps degrees instead of radians
Math.sinus = function (degree) {
    return Math.sin((degree / 180) * Math.PI);
};

// Game Data 

let phase = "waiting";   // waiting | stretching | turning | walking | trasitioning | falling
let lastTimestamp ;    //The timestamp of the previous requestAnimationFrame cycle.

let HeroX ;    // Changes when moving forward
let HeroY ;    // Only changes when falling
let sceneOffset ;  // Moves the whole game

let platforms = [];
let sticks = [];
let trees = [];

// Todo: Save high score to localStorage (?)

let score = 0;

// Configuration 
const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const heroDistanceFromEdge = 10;  // While hero waiting
const paddingX = 100;    // The waiting position of the hero in from tha original canvas size
const perfectAreaSize = 10 ;

// The background moves slower than the hero
const backgroundSpeedMultiplier = 0.2;

const hill1BaseHeight = 100;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 70;
const hill2Amplitude = 20;
const hill2Stretch = 0.5; 

const stretchingSpeed = 4;  //Milliseconds it takes to draw a pixel
const turningSpeed = 4;     //Milliseconds it takes to turn a degree
const walkingSpeed = 4;
const fallingSpeed = 2;
const trasitioningSpeed = 2;

const heroWidth = 17;    //24
const heroHeight = 30;  //40

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;  // Make the Canvas full screen.   width:778 
canvas.height = window.innerHeight;          // height:650

const ctx = canvas.getContext("2d")
console.log(ctx);

const introductionElement = document.getElementById("introduction");
const restartButton = document.getElementById("restart");
const scoreElement = document.getElementById("score");
const perfectElement = document.getElementById("perfect");

//Initialize layout
resetGame();

// Resets game variables and layouts but does not start the game (game starts on keypress)
function resetGame() {
    score = 0;
    sceneOffset = 0;
    lastTimestamp = undefined;
    phase = "waiting";

    introductionElement.style.opacity = 1;
  restartButton.style.display = "none";
  scoreElement.innerText = score;
 perfectElement.style.opacity = 0;

// The first platform is always the same 
// x + w has to match paddingX
platforms = [{ x:50, w:50 }];
generatePlatform();
generatePlatform();
generatePlatform();
generatePlatform();
generatePlatform();

sticks = [{ x:platforms[0].x + platforms[0].w,
length: 0, rotation:0 }];

trees = [];
generateTree();
generateTree();
generateTree();
generateTree();
generateTree();
generateTree();
generateTree();
generateTree();
generateTree();
generateTree();
}

