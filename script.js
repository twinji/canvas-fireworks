// point data type
var Vector2 = function(x, y) {
  this.x = x;
  this.y = y;
}

// firework particle data
var maxFireworkParticles = 50;
var fireworkParticlePositions;
var fireworkParticleVelocities;
var fireworkParticleLifespans;
var gravityAcc = 2;

window.onload = function(e) {

    // canvas setup
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // initial setup
    init(c);
    
    // main logic loop
    var loop = function() {
        update();
        render(c);
        window.requestAnimationFrame(loop, canvas);
    }
    window.requestAnimationFrame(loop, canvas);
}

function init(c) {

  // initialize firework particle data
  fireworkParticlePositions = new Array(maxFireworkParticles);
  fireworkParticleVelocities = new Array(maxFireworkParticles);
  fireworkParticleLifespans = new Array(maxFireworkParticles);

}

function update() {}

function render(c) {}