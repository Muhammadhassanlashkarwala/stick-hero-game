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

let heroX ;    // Changes when moving forward
let heroY ;    // Only changes when falling
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

heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
heroY = 0;

draw();
}

function generateTree() {
    minimumGap  = 30;
    maximumGap = 150;


// X coordinate of the rigth edge of the furthest tree
const lastTree = trees[trees.length - 1];
const furthestX = lastTree ? lastTree.x : 0;

const x = 
furthestX +
minimumGap +
Math.floor(Math.random() * (maximumGap - minimumGap));

const treeColors = ["#6D8821" , "#8FAC34" , "#98B333"];

const color = treeColors [Math.floor(Math.random() *3)];

trees.push({ x, color});
}
function generatePlatform() {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    // X coordinate of the rigth edge of the furthest platform
    const lastPlatform = platforms[platforms.length - 1]
    let furthestX = lastPlatform.x + lastPlatform.w ;

    const x = 
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

    const w =
    minimumWidth + Math.floor(Math.random() * (maximumGap - minimumGap));

    platforms.push({ x, w});
}

resetGame();

// If space was pressed restart the game
window.addEventListener("keydown" , (e)=>{
  if (e.key == " ") {
    e.preventDefault();
    resetGame();
    return;
  }
});

window.addEventListener("mousedown" , (e)=>{
  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup" , (e)=>{
    if (phase == "stretching") {
     phase = "turning";
    }
  });

  window.addEventListener("rezise" , (e)=>{
   canvas.width = window.innerWidth;
   canvas.hieght = window.innerHeight;
   draw();
  });

  window.requestAnimationFrame(animate);

  // This is a main loop of game

  function animate(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
    };
 

  switch (phase) {
    case "waiting":
        return;   //stop the loop
        case "stretching": {
      sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
      break;
        }   
        case "turning": {
            sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;
           
            if (sticks.last().rotation > 90) {
                sticks.last().rotation = 90;

                const[nextPlatform, perfectHit] = PlatformTheStickHits();
                if (nextPlatform) {
                    //Increase score
                    score += perfectHit ? 2 : 1 ;
                    scoreElement.innerText = score;

                    if (perfectHit) {
                      perfectElement.style.opacity = 1;
                      setTimeout(()  => (perfectElementstyle.opacity = 0 ),1000);
                    }
                    generatePlatform();
                    generateTree();
                    generateTree();
                }
           phase = "walking"
            }
            break;
              }   
              case "walking" : {
                heroX += (timestamp - lastTimestamp) / walkingSpeed;
                const [nextPlatform] = PlatformTheStickHits();
                if (nextPlatform) {
                  // If hero will reach another platform then limit it's position at it's edge
                  const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
                  if (heroX > maxHeroX) {
                    heroX = maxHeroX;
                    phase = "transitioning";
                  }
                } else{
                    // If hero won't reach another platform them limit it's position at the end of the pole.
                    const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
                    if (heroX > maxHeroX) {
                      heroX = maxHeroX;
                      phase = "falling";
                    }
                  }
                  break;
              }
              case "transitioning" : {
                sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;
                const [nextPlatform] = PlatformTheStickHits();
                if (sceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
                  // Add the next step 
                  sticks.push({
                    x: nextPlatform.x + nextPlatform.w,
                    length : 0,
                    rotation : 0,
                  });
                  phase = "waiting"
                }
                break;
              }
              case "falling" : {
                if (sticks.last().rotation < 180 ) 
                   sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;
                    heroY += (timestamp - lastTimestamp) / fallingSpeed;
                    const maxHeroY = platformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
                    if (heroY > maxHeroY) {
                      restartButton.style.display = "block";
                      return;
                    }
                    break;
                }
                 default: throw Error("Wrong phase");
              }


            draw();
            window.requestAnimationFrame(animate);

            lastTimestamp = timestamp ;
          };     
  
          // Returns the platform the stick hit (if it didn't hit any stick then return undefined)

          function PlatformTheStickHits() {
            if (sticks.last().rotation != 90) {
              throw Error(`Sticks is ${sticks.last().rotation}°`);
              const stickFarX = sticks.last().x + sticks.last().length;

              const PlatformTheStickHits = platforms.find((platform)=> platform.x < stickFarX < platform.x + platform.w);
              
                // If the stick hits the perfect area
                 if (PlatformTheStickHits && PlatformTheStickHits.x + PlatformTheStickHits.w / 2 - perfectAreaSize /  2 < stickFarX &&
                stickFarX < PlatformTheStickHits.x + PlatformTheStickHits.w / 2 + perfectAreaSize /  2) 
                return [PlatformTheStickHits, true];
                return [PlatformTheStickHits, false];
                {
                  
                 }
            };
            function draw() {
              
            }
          }