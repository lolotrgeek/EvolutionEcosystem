// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Evolution EcoSystem

// Creature class

// Create a "bloop" creature
class Bloop {
  constructor(l, dna_) {
    this.position = l.copy(); // Location
    this.health = 200; // Life timer
    this.xoff = random(1000); // For perlin noise
    this.yoff = random(1000);
    this.dna = dna_; // DNA
    // DNA will determine size and maxspeed
    // The bigger the bloop, the slower it is
    this.maxspeed = map(this.dna.genes[0], 0, 1, 15, 0);
    this.r = map(this.dna.genes[0], 0, 1, 0, 50);
    this.attractions = [random(0, 1)] // trait(s) this agent is attracted to
  }

  run() {
    this.update();
    this.borders();
    this.display();
  }

  // A bloop can find food and eat it
  eat(f) {
    let food = f.getFood();
    // Are we touching any food objects?
    for (let i = food.length - 1; i >= 0; i--) {
      let foodLocation = food[i];
      let d = p5.Vector.dist(this.position, foodLocation);
      // If we are, juice up our strength!
      if (d < this.r / 2) {
        this.health += 100;
        food.splice(i, 1);
      }
    }
  }

  reproduce(bloops) {
    // sexual reproduction
    bloops.forEach(bloop => {
      let distance = p5.Vector.dist(this.position, bloop.position)
      let fuzz = 0.0005
      let attracted = (a, b) => a < fuzz && b < fuzz ? true : false
      // is there another bloop near?
      if (distance > 0 && distance < this.r / 2) {
        let me = this.attractions[0] - bloop.dna.genes[0]
        let them = bloop.attractions[0] - this.dna.genes[0]
        console.log(me, 'near ', them)
        // are we attracted?
        if (attracted(me, them)) {
          let genes = this.dna.genes.concat(bloop.dna.genes)
          console.log(me, 'attracted ', them , genes)
          let childDNA = this.dna.crossover(genes)
          childDNA.mutate(0.01)
          console.log('Reproducing:', childDNA)
          return new Bloop(this.position, childDNA)
        }
      }
      else {
        return null
      }
    })
  }

  a_reproduce() {
    // asexual reproduction
    if (random(1) < 0.0005) {
      // Child is exact copy of single parent
      let childDNA = this.dna.copy();
      // Child DNA can mutate
      childDNA.mutate(0.01);
      return new Bloop(this.position, childDNA);
    } else {
      return null;
    }
  }

  move() {
    // Simple movement based on perlin noise
    let vx = map(noise(this.xoff), 0, 1, -this.maxspeed, this.maxspeed);
    let vy = map(noise(this.yoff), 0, 1, -this.maxspeed, this.maxspeed);
    let velocity = createVector(vx, vy);
    this.xoff += 0.01;
    this.yoff += 0.01;

    this.position.add(velocity);
  }

  update() {
    this.move()
    // Death always looming
    this.health -= 0.2;
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > this.width + this.r) this.position.x = -r;
    if (this.position.y > this.height + this.r) this.position.y = -r;
  }

  // Method to display
  display() {
    ellipseMode(CENTER);
    stroke(0, this.health);
    fill(0, this.health);
    ellipse(this.position.x, this.position.y, this.r, this.r);
  }

  // Death
  dead() {
    if (this.health < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}