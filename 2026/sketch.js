let paths = [];

let framesBetweenParticles = 15;
let nextParticleFrame = 0;
let previousParticlePosition;
let particleFadeFrames = 150;
let nextImageIndex = 0;

let particleImages = [];

const assetFolder = "../assets/";
const assetVersion = "20250930";

let imageFiles = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "10.png",
];

function preload() {
  for (let file of imageFiles) {
    particleImages.push(
      loadImage(`${assetFolder}${file}?v=${assetVersion}`)
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  previousParticlePosition = createVector(mouseX, mouseY);

  describe(
    'When the cursor hovers on the black background, it draws a pattern of shapes (from PNGs) outlined in white and connected by white lines. The shapes fade out over time.'
  );
}

function draw() {
  background(0);

  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (frameCount >= nextParticleFrame) {
      if (paths.length === 0) {
        paths.push(new Path());
        previousParticlePosition.set(mouseX, mouseY);
      }
      createParticle();
    }
  }

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

class Path {
  constructor() {
    this.particles = [];
  }

  addParticle(position, velocity) {
    let img = particleImages[nextImageIndex];
    nextImageIndex = (nextImageIndex + 1) % particleImages.length;
    this.particles.push(new Particle(position, velocity, img));
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }
  }

  connectParticles(particleA, particleB) {
    let opacity = particleA.framesRemaining / particleFadeFrames;
    stroke(255, opacity);
    drawingContext.setLineDash([1, 2]);
    line(
      particleA.position.x,
      particleA.position.y,
      particleB.position.x,
      particleB.position.y
    );
    drawingContext.setLineDash([]);
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
    image(this.image, this.position.x, this.position.y, 60, 64);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
