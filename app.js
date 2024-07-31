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