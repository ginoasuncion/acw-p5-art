let paths = [];

let framesBetweenParticles = 15;
let nextParticleFrame = 0;
let previousParticlePosition;
let particleFadeFrames = 150;

// Array to store your images
let particleImages = [];

// Use the exact filenames from your Sketch Files panel
let imageFiles = [
  "blob_red.png",
  "burst.png",
  "circle_blue.png",   // replace with exact name in sidebar
  "diamond.png",
  "flower.png",
  "hexagon.png",
  "squiggle.png",
  "star_shape.png",    // replace with exact name in sidebar
  "triangle_green.png",// replace with exact name in sidebar
  "weirdshape01.png"   // replace with exact name in sidebar
];

function preload() {
  for (let file of imageFiles) {
    particleImages.push(loadImage(file)); // no "assets/" needed in Web Editor
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // full responsive canvas
  colorMode(HSB);

  previousParticlePosition = createVector(mouseX, mouseY);

  describe(
    'When the cursor hovers on the black background, it draws a pattern of shapes (from PNGs) outlined in white and connected by white lines. The shapes fade out over time.'
  );
}

function draw() {
  background(0);

  // Spawn particles on hover
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (frameCount >= nextParticleFrame) {
      // If no path exists yet, create one
      if (paths.length === 0) {
        paths.push(new Path());
        previousParticlePosition.set(mouseX, mouseY);
      }
      createParticle();
    }
  }

  // Update and draw all paths
  for (let path of paths) {
    path.update();
    path.display();
  }
}

function createParticle() {
  let mousePosition = createVector(mouseX, mouseY);
  let velocity = p5.Vector.sub(mousePosition, previousParticlePosition);
  velocity.mult(0.05);

  let lastPath = paths[paths.length - 1];
  lastPath.addParticle(mousePosition, velocity);

  nextParticleFrame = frameCount + framesBetweenParticles;
  previousParticlePosition.set(mouseX, mouseY);
}

// Path class
class Path {
  constructor() {
    this.particles = [];
  }

  addParticle(position, velocity) {
    let randomImage = random(particleImages);
    this.particles.push(new Particle(position, velocity, randomImage));
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }
  }

  connectParticles(particleA, particleB) {
    let opacity = particleA.framesRemaining / particleFadeFrames;
    stroke(255, opacity);
    line(
      particleA.position.x,
      particleA.position.y,
      particleB.position.x,
      particleB.position.y
    );
  }

  display() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].framesRemaining <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.particles[i].display();

        if (i < this.particles.length - 1) {
          this.connectParticles(this.particles[i], this.particles[i + 1]);
        }
      }
    }
  }
}

// Particle class
class Particle {
  constructor(position, velocity, img) {
    this.position = position.copy();
    this.velocity = velocity.copy();
    this.image = img;
    this.drag = 0.95;
    this.framesRemaining = particleFadeFrames;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.mult(this.drag);
    this.framesRemaining--;
  }

  display() {
    let opacity = this.framesRemaining / particleFadeFrames;

    push();
    tint(255, opacity * 255);
    imageMode(CENTER);

    // Draw all images at 60x64 px
    image(this.image, this.position.x, this.position.y, 60, 64);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

