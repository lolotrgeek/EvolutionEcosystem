// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Evolution EcoSystem

// Creature class

// Create a "bloop" creature
class Bloop {
  constructor(l, dna_) {
    this.position = l.copy() // Location
    this.health = 200 // Life timer
    this.xoff = random(1000)
    this.yoff = random(1000)
    this.dna = dna_ // DNA
    // DNA will determine size and maxspeed
    // The bigger the bloop, the slower it is
    this.maxspeed = map(this.dna.genes[0], 0, 1, 15, 0)
    this.radius = map(this.dna.genes[0], 0, 1, 0, 50)
    this.skin = this.radius / 2
    this.attractions = [random(0, 1)] // trait(s) this agent is attracted to
  }

  spin() {
    this.update()
  }

  eat(f) {
    let food = f.getFood()
    // Are we touching any food objects?
    for (let i = food.length - 1; i >= 0; i--) {
      let foodLocation = food[i]
      let d = p5.Vector.dist(this.position, foodLocation)
      // If we are, juice up our strength!
      if (d < this.radius / 2) {
        this.health += 100
        food.splice(i, 1)
      }
    }
  }

  nearby(bloops) {
    return bloops.filter(bloop => {
      let distance = p5.Vector.dist(this.position, bloop.position)
      if (distance > this.skin && distance < this.skin + 100) {
        return true
      }
      else return false
    })
  }

  select(nearby) {
    // select a mate
    let selection = nearby.filter(bloop => {
      let me = Math.abs(this.attractions[0] - bloop.dna.genes[0])
      let them = Math.abs(bloop.attractions[0] - this.dna.genes[0])
      // ignore any nearby bloops that are not attractive...
      let attracted = (a, b) => a > fuzz && b > fuzz ? true : false
      if (attracted(me, them)) return true
      else return false
    })
    let mate
    // if there is more than one potential mate...
    if (selection.length > 1) {
      mate = Array.max(selection) // reproduce with the most attractive one
    } else {
      mate = selection[0]
    }
    return mate
  }

  reproduce(mate) {
    // local sexual reproduction
    if (mate && random(1) < odds) {
      // console.log('Mate:', mate)
      let genes = this.dna.genes.concat(mate.dna.genes)
      let childDNA = this.dna.crossover(genes)
      childDNA.mutate(0.01)
      // console.log('Reproducing!', childDNA)
      return new Bloop(this.position, childDNA)
    }
    else return null
  }

  a_reproduce() {
    // asexual reproduction
    if (random(1) < 0.0005) {
      // Child is exact copy of single parent
      let childDNA = this.dna.copy();
      // Child DNA can mutate
      childDNA.mutate(0.01);
      return new Bloop(this.position, childDNA)
    } else {
      return null;
    }
  }

  brain() {
    let vx = map(noise(this.xoff), 0, 1, -this.maxspeed, this.maxspeed)
    let vy = map(noise(this.yoff), 0, 1, -this.maxspeed, this.maxspeed)
    let coords = createVector(vx, vy)
    this.xoff += 0.01
    this.yoff += 0.01
    return coords
  }

  move(x, y) {
    this.position.x = position.x + x
    this.position.y = position.y + y
  }

  update() {
    let movement = this.brain()
    this.position.add(movement)
    // Death always looming
    this.health -= 0.2
  }

  phenotype() {
    let r = 0
    let g = 0
    let b = Math.round(this.attractions[0] * 100)
    return { r, g, b }
  }

  // Death
  dead() {
    if (this.health < 0.0) {
      return true
    } else {
      return false
    }
  }
}