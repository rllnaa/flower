var canvas = document.getElementById("c");
var context = canvas.getContext("2d");
var canvasWidth = canvas.width = 400;
var centerX = canvasWidth / 2;
var canvasHeight = canvas.height = 400;
var centerY = canvasHeight / 2;
var frameCounter = 0;
var radius = 100;
var totalParticles = 300;
var particleArray = [];
var connectionDistance = 25;
var hueColors = [340, 350, 360, 0, 10, 20];

context.fillStyle = "rgba(0,0,0,.05)";
var circleX = [canvasWidth / 2, canvasWidth / 2 + radius, canvasWidth / 2 - radius];
var circleY = [canvasHeight / 2, radius, radius];

function Particle() {
  var angle = Math.random() * 2 * Math.PI;
  var randomRadius = ~~(Math.random() * radius);
  var randomIndex = Math.floor(Math.random() * 3);
  this.x = circleX[randomIndex] + randomRadius * Math.cos(angle);
  this.y = circleY[randomIndex] + randomRadius * Math.sin(angle);
  this.ix = Math.random() * (Math.random() < 0.5 ? -1 : 1);
  this.iy = Math.random() * (Math.random() < 0.5 ? -1 : 1);
  this.hue = hueColors[Math.round(Math.random() * hueColors.length) + 1];
}

function createParticle() {
  var newParticle = new Particle();
  particleArray.push(newParticle);
}

for (var i = 0; i < totalParticles / 2; i++) {
  createParticle();
}

function Draw() {
  frameCounter++;
  if (frameCounter % 2 == 0 && particleArray.length < totalParticles) {
    createParticle();
  }

  context.fillRect(0, 0, canvasWidth, canvasHeight);
  thePath(radius, 1);
  context.strokeStyle = "hsla(0, 51%, 36%, 0.56)";
  context.stroke();
  
  for (var i = 0; i < particleArray.length; i++) {
    context.fillStyle = particleArray[i].c;
    if (context.isPointInPath(particleArray[i].x, particleArray[i].y)) {
      particleArray[i].x += particleArray[i].ix;
      particleArray[i].y += particleArray[i].iy;
    } else {
      particleArray[i].ix = -1 * particleArray[i].ix;
      particleArray[i].iy = -1 * particleArray[i].iy;
      particleArray[i].x += particleArray[i].ix;
      particleArray[i].y += particleArray[i].iy;
    }
  }

  compare();
  window.requestAnimationFrame(Draw);
}

window.requestAnimationFrame(Draw);

function compare() {
  for (var i = 0; i < particleArray.length; i++) {
    var particleA = particleArray[i];
    for (var j = i + 1; j < particleArray.length; j++) {
      var particleB = particleArray[j];
      var dist = distance(particleA, particleB);
      if (dist < connectionDistance) {
        var alpha = (connectionDistance - dist) / connectionDistance;
        var hue = particleA.hue;
        context.strokeStyle = "hsla(" + hue + ",87%, 44%," + alpha + ")";
        context.beginPath();
        context.moveTo(particleA.x, particleA.y);
        context.lineTo(particleB.x, particleB.y);
        context.stroke();
      }
    }
  }
}

function distance(a, b) {
  var deltaY = b.y - a.y;
  var deltaX = b.x - a.x;
  var hypotenuse = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
  return hypotenuse;
}

function thePath(R, r) {
  context.beginPath();
  context.moveTo(200, R);
  context.arc(300, R, R - r, Math.PI, Math.PI * 0.23);
  context.lineTo(200, 350);
  context.arc(100, R, R - r, Math.PI * 0.77, 0);
}

function randomIntFromInterval(mn, mx) {
  return ~~(Math.random() * (mx - mn + 1) + mn);
}
