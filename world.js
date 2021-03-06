// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Evolution EcoSystem

// The World we live in
// Has bloops and food

// Constructor
class World {
  constructor(num) {
    // Start with initial food and creatures
    this.food = new Food(num)
    this.bloops = [] 
    for (let i = 0; i < num; i++) {
      let l = createVector(random(width), random(height))
      let dna = new DNA()
      this.bloops.push(new Bloop(l, dna))
    }
  }

  // Make a new creature
  born(x, y) {
    let l = createVector(x, y)
    let dna = new DNA()
    this.bloops.push(new Bloop(l, dna))
  }

  distance(position, objective, attractions){
    let d = int(dist(position.x, position.y, objective.x, objective.y))

    // Draw distance
    push()
    fill(0)
    line(position.x, position.y, objective.x, objective.y)    
    translate((position.x + objective.x) / 2, (position.y + objective.y) / 2)
    rotate(atan2(objective.y - position.y, objective.x - position.x))
    fill('#fff')
    text(nfc(attractions, 1), 0, -5)
    pop()    
  }

  // Run the world
  run() {
    // Deal with food
    this.food.run()

    // Cycle through the ArrayList backwards b/c we are deleting
    for (let i = this.bloops.length - 1; i >= 0; i--) {
      // All bloops run and eat
      let b = this.bloops[i]
      // this.bloops.map(bloop => this.distance(b.position, bloop.position))
      b.run()
      b.eat(this.food)
      if (b.dead()) {
        this.bloops.splice(i, 1)
        this.food.add(b.position)
      }
      // see if there are any nearby mates
      let nearby = b.nearby(this.bloops)
      if( nearby.length > 0 ){
        nearby.map(near => {
          this.distance(b.position, near.position, b.attractions)
        })
        let mate = b.select(nearby)
        let child = b.reproduce(mate)
        if (child != null) this.bloops.push(child)

      }
    }
  }
}