// Evolution EcoSystem

// Creature class

// Create an "agent" creature
class Agent {
  constructor(l, dna_) {
    this.position = l.copy() // Location
    this.health = 200 // Life timer
    this.dna = dna_ // DNA
    this.maxspeed = map(this.dna.genes[0], 0, 1, 15, 0)
    this.r = map(this.dna.genes[0], 0, 1, 0, 50)
    this.skin = this.r / 2
  }

  spin() {
    this.update()
    this.borders()
    this.display()
  }

  brain(observation) {
    let action
    return action
  }

  move(x,y){
    this.position.x = position.x + x
    this.position.y = position.y + y
  }

  update() {
    let movement = this.brain()
    this.position.add(movement )
    // Death always looming
    this.health -= 0.2
  }

  phenotype() {
    let r = Math.round(this.attractions[0] * 100) 
    let g = 0
    let b = 0
    fill(r, g, b, this.health)
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.x > this.width + this.r) this.position.x = -r
    if (this.position.y > this.height + this.r) this.position.y = -r
  }

  // Method to display
  display() {
    ellipseMode(CENTER)
    stroke(0, this.health)
    this.phenotype()
    ellipse(this.position.x, this.position.y, this.r, this.r)
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