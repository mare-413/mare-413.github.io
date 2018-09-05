var popu;
var debug = true;

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  popu = new Population(50, 65, 6);
}

function draw() {
  background(12, 17, 14);
  popu.run();
}

function mousePressed() {
  popu.addV(null, mouseX, mouseY);
}

function Population(vehi_, food_, pred_) {
  this.vehicles = [];
  this.food = [];
  this.predators = [];

  for (var i = 0; i < vehi_; i++) this.vehicles.push(new Vehicle());

  for (var i = 0; i < food_; i++) this.food.push(createVector(random(25, width - 25), random(25, height - 25)));

  for (var i = 0; i < pred_; i++) this.predators.push(new Predator());

  this.run = function() {
    for (var i = 0; i < this.vehicles.length; i++) {
      this.vehicles[i].sides();
      this.vehicles[i].applyForce(this.vehicles[i].seek(this.food, this.vehicles[i].dna.foodP, this.vehicles[i].dna.foodW));
      this.vehicles[i].eat(this.food, 100 - this.vehicles[i].health);
      this.vehicles[i].applyForce(this.vehicles[i].seek(this.predators, this.vehicles[i].dna.predP, this.vehicles[i].dna.predW));
      this.vehicles[i].update();
      this.vehicles[i].show();
      this.vehicles[i].reproduce();
      this.vehicles[i].die();
    }

    for (var i = 0; i < this.food.length; i++) {
      noStroke();
      fill(255, 255, 108);
      ellipse(this.food[i].x, this.food[i].y, 5, 5);
    }

    for (var i = 0; i < this.predators.length; i++) {
      this.predators[i].update();
      this.predators[i].wrap();
      this.predators[i].show();
    }
  }

  this.addV = function(dna_, x_, y_) {
    if (dna_) newDna = dna_;
    else return this.vehicles.push(new Vehicle(null, x_, y_));

    var mr = 0.05;
    if (random(1) < mr) {
      if (newDna.foodW - 0.1 > newDna.max[0] && newDna.foodW + 0.1 < newDna.max[1]) {
        newDna.foodW += random(-0.1, 0.1);
      }
    }
    if (random(1) < mr) {
      if (newDna.predW - 0.1 > newDna.max[0] && newDna.predW + 0.1 < newDna.max[1]) {
        newDna.predW += random(-0.1, 0.1);
      }
    }
    if (random(1) < mr) {
      if (newDna.foodP - 10 > newDna.max[2] && newDna.foodP + 10 < newDna.max[3]) {
        newDna.foodP += random(-10, 10);
      }
    }
    if (random(1) < mr) {
      if (newDna.predP - 0.1 > newDna.max[2] && newDna.predP + 10 < newDna.max[3]) {
        newDna.predP += random(-10, 10);
      }
    }
    this.vehicles.push(new Vehicle(newDna, x_, y_));
  }
}

function Vehicle(dna_, x_, y_) {
  this.pos = x_ && y_ ? createVector(x_, y_) : createVector(random(width), random(height));
  this.vel = createVector(random(-0.3, 0.3), random(-0.3, 0.3));
  this.vel.setMag(6);
  this.acc = createVector(0, 0);
  this.dna = dna_ ? dna_ : {
    foodW: random(-2, 2),
    predW: random(-2, 2),
    foodP: random(10, 300),
    predP: random(10, 300),
    max: [-2, 2, 10, 300]
  };
  this.size = 5.7;
  this.health = 100;
  this.maxspeed = 6;
  this.maxforce = 0.8;

  this.show = function() {
    var off = this.size / 5;
    push();
    noStroke();
    fill(255, 45, 26);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + 90);

    beginShape();
    vertex(0, -this.size * 2);
    vertex(-this.size, this.size * 1.6);
    vertex(this.size, this.size * 1.6);
    endShape(CLOSE);

    pop();

    if (dist(mouseX, mouseY, this.pos.x, this.pos.y) < 100 && debug) {
      textAlign(CENTER, CENTER);
      fill(255);
      noStroke();
      text(this.health.toFixed(2) + "%", this.pos.x, this.pos.y - 20);

      fill(45, 205, 170);
      rect(this.pos.x, this.pos.y + 20, map(this.dna.predW, -2, 2, -25, 25), 4);
      fill(255, 255, 108);
      rect(this.pos.x, this.pos.y + 26, map(this.dna.foodW, -2, 2, -25, 25), 4);

      noFill();
      stroke(45, 205, 170);
      ellipse(this.pos.x, this.pos.y, this.dna.predP * 2, this.dna.predP * 2);
      stroke(255, 255, 108);
      ellipse(this.pos.x, this.pos.y, this.dna.foodP * 2, this.dna.foodP * 2);
    }
  }

  this.update = function() {
    this.health -= 0.3;

    this.vel.add(this.acc);

    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.seek = function(target_, perception, rel) {
    var desired;

    var target = target_;
    //print(target);
    if (target.constructor === Array) {
      var record = Infinity;
      var closest = null;
      for (var i = target.length - 1; i >= 0; i--) {
        var vec = target[0].constructor === p5.Vector ? target[i] : target[i].pos;
        var d = this.pos.dist(vec);

        if (d < record && d < perception) {
          record = d;
          closest = vec;
        }
      }
      if (closest != null) desired = p5.Vector.sub(closest, this.pos);
      else return createVector(0, 0);
    } else if (target.constructor === p5.Vector) desired = target.sub(this.pos);

    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    if (rel) steer.mult(rel);
    return steer;
  }

  this.sides = function() {
    var d = 25;
    var desired = null;

    if (this.pos.x < d) desired = createVector(this.maxspeed, this.vel.y);
    else if (this.pos.x > width - d) desired = createVector(-this.maxspeed, this.vel.y);

    if (this.pos.y < d) desired = createVector(this.vel.x, this.maxspeed);
    else if (this.pos.y > height - d) desired = createVector(this.vel.x, -this.maxspeed);

    if (desired !== null) {
      desired.setMag(this.maxspeed);
      var steer = desired.sub(this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  this.eat = function(target, nutrition) {
    for (var i = target.length - 1; i >= 0; i--) {
      var d = this.pos.dist(target[i]);

      if (d < 7) {
        target.splice(i, 1);
        this.health += nutrition;
        popu.food.push(createVector(random(25, width - 25), random(25, height - 25)));
      }
    }
  }

  this.die = function() {
    if (this.health <= 0) {
      popu.vehicles.splice(popu.vehicles.indexOf(this), 1);
    }
    for (var i = 0; i < popu.predators.length; i++) {
      if (this.pos.dist(popu.predators[i].pos) < popu.predators[i].size) popu.vehicles.splice(popu.vehicles.indexOf(this), 1);
    }
  }

  this.reproduce = function() {
    if (random(1) < 0.0005) popu.addV(this.dna, this.pos.x, this.pos.y);
  }
}

function Predator() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector();
  //this.acc = createVector();
  this.size = 60;
  this.xoff = random(10000);
  this.yoff = random(10000);

  this.show = function() {
    fill(45, 205, 170);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  this.update = function() {
    this.vel.set(map(noise(this.xoff), 0, 1, -1, 1), map(noise(this.yoff), 0, 1, -1, 1));
    this.vel.setMag(2);
    this.pos.add(this.vel);
    this.xoff += 0.01;
    this.yoff += 0.01;
  }

  this.wrap = function() {
    if (this.pos.x < -this.size) this.pos.x = width + this.size;
    if (this.pos.x > width + this.size) this.pos.x = -this.size;
    if (this.pos.y < -this.size) this.pos.y = height + this.size;
    if (this.pos.y > height + this.size) this.pos.y = -this.size;
  }
}