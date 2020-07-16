//tYPING
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = "";
        this.wordIndex = 0;
        this.wait = parseInt(wait, 7);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove characters
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add charaters
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 200;

        if (this.isDeleting) {
            // Increase speed by half when deleting
            typeSpeed /= 3;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 1000;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener("DOMContentLoaded", init);

// Init App
function init() {
    const txtElement = document.querySelector(".txt-type");
    const words = JSON.parse(txtElement.getAttribute("data-words"));
    const wait = txtElement.getAttribute("data-wait");
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
}


//MESH POINT

//Based on tutioral - http://thenewcode.com/1159/Create-a-Dynamic-Point-Mesh-Animation-with-HTML5-Canvas

// resize function, called to detect the new height and width
let resizeReset = function() {
    w = canvasBody.width = window.innerWidth - 20;
    h = canvasBody.height = window.innerHeight;
}

// Setting default values for the script
const opts = {
    particleColor: "rgb(200,200,200)",
    lineColor: "rgb(200,200,200)",
    particleAmount: 40,
    defaultSpeed: 1,
    variantSpeed: 1,
    defaultRadius: 2,
    variantRadius: 2,
    linkRadius: 200,
}

// If the widnow is resized called deBouncer();
window.addEventListener("resize", function(){
    deBouncer();
});

// Debounce script to ensure doesn't slow page down
let deBouncer = function() {
    clearTimeout(tid);
    tid = setTimeout(function() {
        resizeReset();
    }, delay);
};

// Creates each dot
Particle = function(xPos, yPos){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
    this.directionAngle = Math.floor(Math.random() * 360);
    this.color = opts.particleColor;
    this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
    // returns either -1 or 1, for the directions
    this.vector = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed
    };
    this.update = function(){
        // Check the position before updating
        this.border();
        this.x += this.vector.x;
        this.y += this.vector.y;
    };
    this.border = function(){
        // checks the next position
        // If it's past the border produce opposite direction
        if (this.x >= w || this.x <= 0) {
            this.vector.x *= -1;
        }
        if (this.y >= h || this.y <= 0) {
            this.vector.y *= -1;
        }
        // A window resize coudl leave the particl out of view so set it to the edge
        if (this.x > w) this.x = w;
        if (this.y > h) this.y = h;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
    };
    // Draw the shape
    this.draw = function(){
        drawArea.beginPath();
        drawArea.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        drawArea.closePath();
        drawArea.fillStyle = this.color;
        drawArea.fill();
    };
};

// Finds out the distance between each point for the lines
let checkDistance = function(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Split line RGB into array
//let rgb = opts.lineColor.match(/\d+/g);
let rgb = [Math.floor(Math.random() * 200) + 0, Math.floor(Math.random() * 200) + 0, Math.floor(Math.random() * 200) + 0]

// Generates link points
// parameters include the point and all the points  to check aginst
let linkPoints = function(point1, hubs){
    // loop through the points
    for (let i = 0; i < hubs.length; i++) {
        // check distance between points
        let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
        // Wizardry here, closer the points the higher opacity the line
        // 1-200/200 = 0
        // 1-199/200 = 0.0050000000000000044
        // 1-10/200 = 0.95
        let opacity = 1 - distance / opts.linkRadius;
        if (opacity > 0) {
            drawArea.lineWidth = 0.5;
            drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
            drawArea.beginPath();
            drawArea.moveTo(point1.x, point1.y);
            drawArea.lineTo(hubs[i].x, hubs[i].y);
            drawArea.closePath();
            drawArea.stroke();
        }
    }
};

// Create the particlas array then call the loop with requestAnimationFrame
function setup(){
    particles = [];
    for (let i = 0; i < opts.particleAmount; i++){
        particles.push( new Particle() );
    }
    window.requestAnimationFrame(loop);
}

function loop(){
    // refreshing requestAnimationFrame gives the animation effect
    window.requestAnimationFrame(loop);
    // Clear the canvas area
    drawArea.clearRect(0,0,w,h);
    // Update the positions and draw them
    for (let i = 0; i < particles.length; i++){
        particles[i].update();
        particles[i].draw();
    }
    // Loops the lines
    // Passing individual particle and the whole obj
    for (let i = 0; i < particles.length; i++){
        linkPoints(particles[i], particles);
    }
}

// Set the canvas, drawarea, delay and call the functions
const canvasBody = document.getElementById("canvas");
const drawArea = canvasBody.getContext("2d");
let delay = 200, tid;
resizeReset();
setup();

//COLOR STRIP



let  main = document.getElementById("main");
function findPos(elem) {
    let box = elem.getBoundingClientRect(),
        offset   = box.top + window.pageYOffset;

    alert('Element is ' + offset + ' vertical pixels from <body>');
    console.log(box.top);
    return offset;
}

mainPos = findPos(main);

window.onscroll = function colorChange(){
    const link = document.getElementsByClassName('change');

    for (i = 0; i < 3; i++){
        if (document.documentElement.scrollTop >= mainPos){
            link[i].classList.add('changeColor');
        }
        if (document.documentElement.scrollTop < mainPos){
            link[i].classList.remove('changeColor');
        }
    }
    let scrollFromTop = document.documentElement.scrollTop;

    console.log(scrollFromTop)
};

console.log(mainPos);
