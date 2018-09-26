var popu, target, gen = 0;

var genP, maxfitP, doneP;

//feel free to play with these values
var populationSize = 350,
   mutationRate = 0.01;

//add obstacles
var obs = [{
   h: 210,
   w: 24,
   x: 490,
   y: -7
}, {
   h: 220,
   w: 24,
   x: 317,
   y: 151
}];

var tmpCx, tmpCy;

var toAdd = false,
   cb, rerun;

function setup() {
   createCanvas(800, 350);
   //new Population object which contains the balls array and the mating pool
   popu = new Population();

   target = createVector(width - 15, height / 2);

   cb = createCheckbox('Add obstacle', false);
   cb.changed(() => {
      if (cb.checked()) toAdd = true;
      else toAdd = false;
   });
   cb.position(165, height + 20);

   rerun = createButton("New population");
   rerun.mousePressed(() => {
      popu = new Population();
      gen = 0;
   });
   rerun.position(8, height + 15);

   genP = createP();
   genP.position(300, height + 6);
   maxfitP = createP();
   maxfitP.position(420, height + 6);
   doneP = createP();
   doneP.position(545, height + 6);
}

function draw() {
   background(10);
   //show balls, update their position and check for collisions
   popu.run();

   //once all balls are done, meaning they have hit an obstacle, a wall or the target, evaluate their fitness
   var ballsC = 0;
   for (var a = 0; a < popu.balls.length; a++) {
      if (popu.balls[a].done == true) ballsC++;
   }
   if (ballsC >= popu.popS) popu.evaluate();

   fill(237, 1, 49);
   noStroke();
   ellipse(target.x, target.y, 20, 20);

   //add obstacle junk
   if (tmpCx && tmpCy) {
      fill(252, 129, 8);
      noStroke();
      rectMode(CORNERS);
      rect(tmpCx, tmpCy, mouseX, mouseY);
   }

   for (var i = 0; i < obs.length; i++) {
      fill(252, 129, 8);
      rectMode(CORNER);
      rect(obs[i].x, obs[i].y, obs[i].w, obs[i].h);
   }

   genP.html("Generation: " + gen);
   maxfitP.html("Maxfit: " + popu.maxfit.toFixed(4));
   doneP.html("Done: " + ballsC + "/" + popu.balls.length);
}

//each ball has a DNA object containing the genes array with instructions on how to move
function DNA() {
   this.genes = [];
   this.changes = random(2, 20);

   for (var a = 0; a < this.changes; a++) {
      this.genes[a] = random(0, 15);
   }

   //crossover returns a new DNA object with genes from 2 parents
   this.crossover = function (pB) {
      var newdna = new DNA();
      var less = this.genes.length <= pB.genes.length ? this.genes.length : pB.genes.length;
      var mid = floor(random(less));
      for (var a = 0; a < less; a++) {
         newdna.genes[a] = a < mid ? this.genes[a] : pB.genes[a];
      }
      return newdna;
   }

   //each gene has a 0,005% chance of mutation
   this.mutation = function () {
      for (var a = 0; a < this.genes.length; a++) {
         if (random(1) < mutationRate) this.genes[a] = random(0, 15);
      }
   }
}

function Population() {
   this.balls = [];
   this.popS = populationSize;
   this.maxfit = 0;
   this.matingpool = [];

   for (var a = 0; a < this.popS; a++) {
      this.balls[a] = new Ball();
   }

   //calculate fitness and fill matingpool
   this.evaluate = function () {
      for (var a = 0; a < this.balls.length; a++) {
         this.balls[a].calcF();
         if (this.balls[a].fitness > this.maxfit) this.maxfit = this.balls[a].fitness;
      }

      //greater fitness means greater change of being picked
      this.matingpool = [];
      for (var b = 0; b < this.balls.length; b++) {
         var n = this.balls[b].fitness * 100;
         for (var c = 0; c < n; c++) {
            this.matingpool.push(this.balls[b]);
         }
      }
      this.selection();
   }

   //select parents, apply crossover and generate new population
   this.selection = function () {
      var newBalls = [];
      for (var a = 0; a < this.balls.length; a++) {
         var parentA = random(this.matingpool);
         var parentB = random(this.matingpool);
         var child = parentA.dna.crossover(parentB.dna);
         child.mutation();
         newBalls[a] = new Ball(child);
      }
      this.balls = newBalls;
      gen++;
   }

   this.run = function () {
      for (var a = 0; a < this.balls.length; a++) {
         this.balls[a].update();
         this.balls[a].checkCol();
         this.balls[a].show();
      }
   }
}

function Ball(dna) {
   this.pos = createVector(10, height / 2);
   this.speed = createVector(2, 2.5);
   this.mul = -1;
   this.time = 0;
   this.a = 0;
   this.changes;
   //either take a DNA object or make a new one
   this.dna = dna ? dna : new DNA();

   this.done = false;
   this.fitness = 0;
   this.reached;

   //move according to genes
   this.update = function () {
      if (this.done == false) {
         if (this.time >= this.dna.genes[this.a]) {
            this.a++;
            this.time = 0;
            this.mul *= -1;
         }
         this.speed.set(2, 2.5 * this.mul);
         this.pos.add(this.speed);
      }
   }

   //show the balls
   this.show = function () {
      this.time += 0.1;
      fill(247, 248, 252, 70);
      noStroke();
      ellipse(this.pos.x, this.pos.y, 10, 10);
   }

   //check collisions
   this.checkCol = function () {
      if (this.pos.y > height || this.pos.y < 0 || this.pos.x > width) this.done = true;

      if (dist(this.pos.x, this.pos.y, target.x, target.y) <= (10 / 2) + (20 / 2)) {
         this.done = true;
         this.reached = true;
      }

      for (var i = 0; i < obs.length; i++) {
         if (this.checkObs(obs[i].x, obs[i].y, obs[i].w, obs[i].h, this.pos.x, this.pos.y, 10)) this.done = true;
      }
   }

   //fitness function
   this.calcF = function () {
      this.changes = this.a;
      var a = target.x - this.pos.x;
      var b = this.changes;
      //more points for reaching target
      var c = this.reached ? 3 : 0;
      //reward shorter distance and fewer changes in direction
      this.fitness = map(map(a, 0, width, 2, 0) + map(b, 2, 20, 1, 0) + c, 0, 6, 0, 1);
   }

   this.checkObs = function (rx, ry, rw, rh, cx, cy, diameter) {
      var testX = cx;
      var testY = cy;

      if (cx < rx) testX = rx;
      else if (cx > rx + rw) testX = rx + rw;

      if (cy < ry) testY = ry;
      else if (cy > ry + rh) testY = ry + rh;

      var distance = dist(cx, cy, testX, testY);

      if (distance <= diameter / 2) return true;

      return false;
   }
}

//add obstacles junk
function mousePressed() {
   if (toAdd) {
      tmpCx = mouseX;
      tmpCy = mouseY;
   } else {
      for (var i = 0; i < obs.length; i++) {
         if (mouseX >= obs[i].x && mouseX <= obs[i].x + obs[i].w && mouseY >= obs[i].y && mouseY <= obs[i].y + obs[i].h) {
            obs.splice(i, 1);
            popu.maxfit = 0;
         }
      }
   }
}

function mouseReleased() {
   if (toAdd) {
      var w, h, x, y;
      if (tmpCy > mouseY && tmpCx > mouseX) {
      [x, y, w, h] = [mouseX, mouseY, tmpCx - mouseX, tmpCy - mouseY];
         obs.push({
            x: x,
            y: y,
            w: w,
            h: h
         });
      }

      if (tmpCy < mouseY && tmpCx > mouseX) {
      [w, h, x, y] = [tmpCx - mouseX, mouseY - tmpCy, tmpCx - w, mouseY - h];
         obs.push({
            x: x,
            y: y,
            w: w,
            h: h
         });
      }

      if (tmpCy > mouseY && tmpCx < mouseX) {
      [w, h, x, y] = [mouseX - tmpCx, tmpCy - mouseY, mouseX - w, tmpCy - h];
         obs.push({
            x: x,
            y: y,
            w: w,
            h: h
         });
      }

      if (tmpCy < mouseY && tmpCx < mouseX) {
      [w, h, x, y] = [mouseX - tmpCx, mouseY - tmpCy, tmpCx, tmpCy];
         obs.push({
            x: x,
            y: y,
            w: w,
            h: h
         });
      }
      popu.maxfit = 0;
   }
   tmpCx = false;
   tmpCy = false;
}
