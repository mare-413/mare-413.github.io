var oSize;
var balls = [];
var p = false;
var gui;
var edit = {
   NB: 200,
   GR: 0.9,
   BO: 0.7,
   JP: 30,
   RF: 0
};
var sliderNB, sliderGR, sliderBO, sliderJP, radioRF;

function setup() {
   c = createCanvas(windowWidth, windowHeight);

   oSize = createVector(windowWidth, windowHeight);
   for (var a = 0; a < edit.NB; a++) {
      balls[a] = new Ball();
   }

   sliderNB = createSlider(0, 750, 200);
   sliderNB.position(width - 110, 10);

   sliderGR = createSlider(0, 2.5, 0.9, 0.05);
   sliderGR.position(width - 110, 25);

   sliderBO = createSlider(0, 1, 0.7, 0.05);
   sliderBO.position(width - 110, 40);

   sliderJP = createSlider(0, 60, 40, 1);
   sliderJP.position(width - 110, 55);

   sliderRF = createSlider(0, 1, 0, 1);
   sliderRF.position(width - 110, 70);
}

function draw() {
   //background(52,56,56);
   background(29, 99, 101);

   textSize(12);
   fill(255);
   noStroke();
   textAlign(RIGHT, TOP);

   edit.NB = sliderNB.value();
   edit.GR = sliderGR.value();
   edit.BO = sliderBO.value();
   edit.JP = sliderJP.value();
   edit.RF = sliderRF.value();

   text("Particles", width - 125, 6);
   text("Gravity", width - 125, 21);
   text("Bounce", width - 125, 36);
   text("Jump", width - 125, 51);
   text("Ceiling (Y/N)", width - 125, 66);

   for (var a = 0; a < balls.length; a++) {
      var gravity = createVector(0, edit.GR * balls[a].mass);

      var drag = balls[a].vel.copy();
      drag.normalize();
      var speed = balls[a].vel.mag();
      drag.mult(-0.018 * speed * speed);

      balls[a].applyForce(gravity);
      //balls[a].applyForce(drag);

      balls[a].checkEdges();
      balls[a].update();
      balls[a].show();
   }
}

function Ball() {
   this.pos = createVector(random(0, width), random(0, height));
   this.acc = createVector(0, 0);
   this.vel = createVector(0, 0);
   this.d = random(10, 40);
   this.mass = this.d * 0.5;
   this.col = floor(random(0, 4));

   this.update = function () {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
   };

   this.applyForce = function (f) {
      this.force = f;
      this.acc.add(this.force.div(this.mass));
   };

   this.checkEdges = function () {
      if (this.pos.x > width) {
         this.pos.x = width;
         this.vel.x *= edit.BO * -1;
      } else if (this.pos.x < 0) {
         this.vel.x *= edit.BO * -1;
         this.pos.x = 0;
      }
      if (this.pos.y > height) {
         this.vel.y *= edit.BO * -1;
         this.pos.y = height;
      }
      if (edit.RF) {
         if (this.pos.y < 0) {
            this.vel.y *= edit.BO * -1;
            this.pos.y = 0;
         }
      }
   };

   this.show = function () {
      /*switch (this.col) {
        case 0:
          fill(0,95,107);
          break;
        case 1:
          fill(0,140,158);
          break;
        case 2:
          fill(0,180,204);
          break;
        case 3:
          fill(0,223,252);
          break;
      }*/
      switch (this.col) {
         case 0:
            fill(250, 208, 137);
            break;
         case 1:
            fill(255, 156, 91);
            break;
         case 2:
            fill(245, 99, 74);
            break;
         case 3:
            fill(237, 48, 60);
            break;
      }
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.d, this.d);
   };

   this.jump = function () {
      this.vel.x += random(-3, 3);
      this.vel.y += random(0.5, edit.JP);
   };
}

function keyPressed() {
   if (key == " ") {
      balls.length = 0;
      for (var a = 0; a < edit.NB; a++) {
         balls[a] = new Ball();
      }
   }
   if (keyCode == UP_ARROW) {
      for (var a = 0; a < balls.length; a++) {
         balls[a].jump();
      }
   }
}
