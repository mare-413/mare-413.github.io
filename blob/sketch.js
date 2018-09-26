var popu;
var foods = [];
var selectedID;
var showFood = false;

var edit = {
   FR: 0.00088,
   RR: 0.00047,
   HR: 0.1
};

function setup() {
   createCanvas(windowWidth, windowHeight);

   popu = new Population(35);
   for (var a = 0; a < 10; a++) {
      foods[a] = new Food();
   }

   sliderFR = createSlider(0, 0.0055, 0.00088, 0.000001);
   sliderFR.position(width - 110, 10);

   sliderRR = createSlider(0, 0.0022, 0.00047, 0.000001);
   sliderRR.position(width - 110, 25);

   sliderHR = createSlider(0, 0.4, 0.1, 0.0001);
   sliderHR.position(width - 110, 40);
}

function draw() {
   background(0);

   popu.run();

   if (showFood)
      for (var a = 0; a < foods.length; a++) foods[a].show();

   for (var b = 0; b < popu.balls.length; b++) {
      popu.balls[b].info = popu.balls[b].dna.genes[2] == selectedID ? true : false;
   }

   edit.FR = sliderFR.value();
   edit.RR = sliderRR.value();
   edit.HR = sliderHR.value();

   textSize(12);
   fill(255);
   noStroke();
   textAlign(RIGHT, TOP);

   text("Food spawning rate", width - 125, 7);
   text("Reproduction rate", width - 125, 7 + 15);
   text("Health decrease rate", width - 125, 7 + 15 * 2);
}

function Population(nob) {
   this.balls = [];

   for (var i = 0; i < nob; i++) {
      this.balls[i] = new Ball();
      this.balls[i].dna.genes[2] = i;
   }

   this.run = function () {
      for (var i = 0; i < this.balls.length; i++) {
         this.balls[i].update();
         this.balls[i].checkCol();
         popu.isKill();
         this.balls[i].repro();
         this.balls[i].show();


         if (random(1) < edit.FR) foods.push(new Food());
      }
   };

   this.add = function (bal) {
      var dna = bal.dna;
      var pos = bal.pos;
      this.balls.push(new Ball(dna, pos.x, pos.y));
   };

   this.isKill = function () {
      for (var a = 0; a < this.balls.length; a++) {
         if (this.balls[a].health <= 0) {
            foods.push(new Food(this.balls[a].pos.x, this.balls[a].pos.y));
            this.balls.splice(a, 1);
         }
      }
   };
}

function Ball(dna, x, y) {
   this.health = 100;
   this.info = false;
   this.vel = createVector();
   this.perSeedX = random(100);
   this.perSeedY = random(100);

   this.pos = x && y ? createVector(x, y) : createVector(random(width), random(height));
   this.dna = dna ? dna : new DNA();
   this.size = this.dna.genes[0];

   this.show = function () {
      fill(this.dna.genes[1]);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.dna.genes[0], this.dna.genes[0]);

      if (
         dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.dna.genes[0] ||
         this.info
      ) {
         fill(255);
         textAlign(CENTER, CENTER);
         text(
            this.dna.genes[0].toFixed(1) + " | " + this.health.toFixed(1) + "%",
            this.pos.x,
            this.pos.y - (this.dna.genes[0] / 2 + 15)
         );
      }
   };

   this.update = function () {
      this.perSeedX += 0.01;
      this.perSeedY += 0.01;
      this.vel.set(
         map(noise(this.perSeedX), 0, 1, -1, 1),
         map(noise(this.perSeedY), 0, 1, -1, 1)
      );
      this.vel.normalize();
      this.vel.mult(map(this.dna.genes[0], 0, 100, 5, 0.1));

      this.pos.add(this.vel);

      this.health -= edit.HR;
   };

   this.repro = function () {
      if (random(1) < edit.RR) popu.add(this);
   };

   this.checkCol = function () {
      if (this.pos.x < this.dna.genes[0] * -1) this.pos.x = width + this.dna.genes[0];

      if (this.pos.x > width + this.dna.genes[0]) this.pos.x = this.dna.genes[0] * -1;

      if (this.pos.y < this.dna.genes[0] * -1) this.pos.y = height + this.dna.genes[0];

      if (this.pos.y > height + this.dna.genes[0]) this.pos.y = this.dna.genes[0] * -1;

      for (var a = 0; a < foods.length; a++) {
         if (
            colRC(
               foods[a].pos.x,
               foods[a].pos.y,
               15,
               15,
               this.pos.x,
               this.pos.y,
               this.size
            )
         ) {
            this.health = 100;
            foods.splice(a, 1);
         }
      }
   };
}

function DNA() {
   this.genes = [];

   //size and speed
   this.genes[0] = random(5, 100);
   //color
   this.genes[1] = color(random(255), random(255), random(255), 200);
   //ID
   this.genes[2] = 0;
}

function Food(x, y) {
   this.pos = x && y ? createVector(x, y) : createVector(random(width), random(height));

   this.show = function () {
      fill(255, 200);
      noStroke();
      rect(this.pos.x, this.pos.y, 15, 15);
   }
}

function mousePressed() {
   for (var a = 0; a < popu.balls.length; a++) {
      if (
         dist(mouseX, mouseY, popu.balls[a].pos.x, popu.balls[a].pos.y) <
         popu.balls[a].size / 2
      ) selectedID = popu.balls[a].dna.genes[2];
   }
}

function keyPressed() {
   showFood = showFood ? false : true;
}

function colRC(rx, ry, rw, rh, cx, cy, diameter) {
   var testX = cx;
   var testY = cy;
   testX = cx < rx ? rx : (cx > rx + rw ? rx + rw : rx);
   testY = cy < ry ? ry : (cy > ry + rh ? ry + rh : ry);
   var distance = this.dist(cx, cy, testX, testY);
   if (distance <= diameter / 2) return true;
   return false;
}
