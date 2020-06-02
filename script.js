// window dimensions
const WIDTH = window.innerWidth, 
      HEIGHT = window.innerHeight;

// point data type
var Vector2 = function(x, y) {
  this.x = x;
  this.y = y;
}

// firework particle data
var particlePositions;
var particleVelocities;
var particleLifespans;

// constraints
var maxFireworkParticles = 20000;
var maxParticleCountPerExplosion = 400;
var minParticleSlotsFreeBeforeSpawn = 20;
var maxParticleVelocity = 3;
var minParticleVelocity = 0.75;
var minParticleLifespan = 70;
var maxParticleLifespan = 200;
var maxParticleRadius = 10;

// environment
var gravityAcc = 0.02;

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
  particlePositions = new Array(maxFireworkParticles);
  particleVelocities = new Array(maxFireworkParticles);
  particleLifespans = new Array(maxFireworkParticles);

}

function update() {

  // iterate over particles
  for (var i = 0; i < maxFireworkParticles; i++) {

    if (particlePositions[i] != null) {

      // check if particle needs to be destroyed
      if (particleLifespans[i] <= 0) {
        
        particlePositions[i] = null;
        particleVelocities[i] = null;
        particleLifespans[i] = null;
        
      } else {

        // update positioning using velocity values
        particlePositions[i].x += particleVelocities[i].x;
        particlePositions[i].y -= particleVelocities[i].y;

        // update velocity based on gravity
        particleVelocities[i].y -= gravityAcc;

        // decrement lifespan
        particleLifespans[i]--;

      }
    }
  }

  // count empty particle slots
  var numberOfEmptySlots = 0;
  for (var i = 0; i < maxFireworkParticles; i++) {
    if (!particlePositions[i]) numberOfEmptySlots++;
  }

  // spawn new particles if above limit
  if (numberOfEmptySlots >= minParticleSlotsFreeBeforeSpawn) {

    var numberToSpawn = Math.round(Math.random() * (maxParticleCountPerExplosion > numberOfEmptySlots ? numberOfEmptySlots : maxParticleCountPerExplosion));
    var slotsToPopulate = new Array();

    for (var i = 0; i < numberToSpawn; i++) {
      if (!particlePositions[i]) slotsToPopulate.push(i);
    }

    if (slotsToPopulate.length < minParticleSlotsFreeBeforeSpawn) {
      return;
    }

    var positionX = Math.random() * WIDTH;
    var positionY = Math.random() * HEIGHT;
    var lifespan = minParticleLifespan + Math.random() * (maxParticleLifespan - minParticleLifespan);

    for (var i = 0; i < slotsToPopulate.length; i++) {

      particlePositions[slotsToPopulate[i]] = new Vector2(
        positionX,
        positionY
      );

      // spawn with velocities at different angles
      var angle = Math.PI * 2 * (i / slotsToPopulate.length);
      particleVelocities[slotsToPopulate[i]] = new Vector2(
        Math.cos(angle) * (minParticleVelocity + Math.random() * (maxParticleVelocity - minParticleVelocity)),
        Math.sin(angle) * (minParticleVelocity + Math.random() * (maxParticleVelocity - minParticleVelocity))
      );

      particleLifespans[slotsToPopulate[i]] = lifespan;

    }
  }
}

function render(c) {

  // screen fade out effect
  c.fillStyle = "black";
  c.globalAlpha = 0.05;
  c.fillRect(0, 0, WIDTH, HEIGHT);
  c.globalAlpha = 1;
  c.fillStyle = "white";

  // draw particles
  for (var i = 0; i < maxFireworkParticles; i++) {

    if (particlePositions[i]) {

      c.globalAlpha = Math.min(1, particleLifespans[i] / 60);
      c.beginPath();
      c.arc(particlePositions[i].x, particlePositions[i].y, Math.min(maxParticleRadius, Math.max(0, particleLifespans[i] / 60)), 0, 2 * Math.PI);
      c.fill();
      c.closePath();
      c.globalAlpha = 1;

    }
  }
}
