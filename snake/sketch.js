var popu;
var board;

var brain = [16, [8], 4];

var grid = 30;
var square = 10;

var active;

var look = true;

function setup() {
   createCanvas(grid * square + 200, grid * square + 200);
   rectMode(CENTER, CENTER);
   frameRate(30);

   popu = new Population(500);
   board = new Board(popu.agents[0].dna);

   /*document.getElementById("b1").addEventListener("click", () => {
      if (look) look = false;
      else look = true;
   });*/
}

function draw() {
   background(0);

   if (look) {
      show(board);
      board.changeDir();
      if (!board.run()) {
         board = popu.universalDna ? new Board(popu.universalDna) : new Board(popu.agents[0].dna);
      }
   } else {
      popu.run();
   }

   //document.getElementById("p1").innerHTML = "Sum: " + popu.sum + " | LocalFit: " + popu.localFitness + " | BestFitness: " + popu.universalFitness + " | Gen: " + popu.generation;
   //document.getElementById("p2").innerHTML = "CurScore: " + popu.localScore + " | BestScore: " + popu.bestScore + " | MutRate: " + popu.set.mr + " | Set: " + popu.set.cross + "-" + popu.set.mut;
}

function show(b_) {
   active = b_;
   stroke(0);
   push();
   translate(100, 100);
   for (var i = 0; i < b_.snake.length; i++) {
      fill(100);
      if (i == 0) fill(255);
      rect(b_.snake[i].x * square, b_.snake[i].y * square, square, square);
   }

   var m = b_.inputs();
   fill(0, 255, 0);
   noStroke();
   ellipse((b_.snake[0].x) * square, (b_.snake[0].y - m[0]) * square, 5, 5);
   ellipse((b_.snake[0].x + m[2]) * square, (b_.snake[0].y) * square, 5, 5);
   ellipse((b_.snake[0].x) * square, (b_.snake[0].y + m[4]) * square, 5, 5);
   ellipse((b_.snake[0].x - m[6]) * square, (b_.snake[0].y) * square, 5, 5);

   ellipse((b_.snake[0].x + m[1]) * square, (b_.snake[0].y - m[1]) * square, 5, 5);
   ellipse((b_.snake[0].x + m[3]) * square, (b_.snake[0].y + m[3]) * square, 5, 5);
   ellipse((b_.snake[0].x - m[5]) * square, (b_.snake[0].y + m[5]) * square, 5, 5);
   ellipse((b_.snake[0].x - m[7]) * square, (b_.snake[0].y - m[7]) * square, 5, 5);

   fill(0, 0, 255);
   if (m[12]) ellipse((b_.snake[0].x) * square, (b_.snake[0].y - 3) * square, 5, 5);
   if (m[13]) ellipse((b_.snake[0].x + 3) * square, (b_.snake[0].y) * square, 5, 5);
   if (m[14]) ellipse((b_.snake[0].x) * square, (b_.snake[0].y + 3) * square, 5, 5);
   if (m[15]) ellipse((b_.snake[0].x - 3) * square, (b_.snake[0].y) * square, 5, 5);

   fill(255, 0, 0);
   rect(b_.food.x * square, b_.food.y * square, square, square);

   var gq = grid * square;

   stroke(255);
   line(0, 0, 0, gq);
   line(gq, 0, gq, gq);

   pop();

   fill(255);
   textSize(15);
   text("Sum: " + popu.sum + " | LocalFit: " + popu.localFitness + " | BestFitness: " + popu.universalFitness + " | Gen: " + popu.generation, 100, 35);
   text("CurScore: " + popu.localScore + " | BestScore: " + popu.bestScore, 100, 55);
   text("MR: " + popu.set.mr + " | Cross: " + popu.set.cross + " | Mut: " + popu.set.mut + " | Elite: " + popu.set.elite + " | Innov: " + popu.set.innovation, 100, 75);
   text("Frames: " + b_.frames + " - Lifetime: " + b_.lifetime + " - Score: " + b_.score, 100, gq + 140);
}

function keyPressed() {
   /*
   switch (keyCode) {
      case UP_ARROW:
         active.head.nx = 0;
         active.head.ny = -1;
         break;
      case RIGHT_ARROW:
         active.head.nx = 1;
         active.head.ny = 0;
         break;
      case DOWN_ARROW:
         active.head.nx = 0;
         active.head.ny = 1;
         break;
      case LEFT_ARROW:
         active.head.nx = -1;
         active.head.ny = 0;
         break;
   }*/
   if (key == "T") {
      if (look) look = false;
      else look = true;
   }
}

/*
  }

  this.cross = function(other) {
    return this.dna.cross(other.dna);
  }

  this.copy = function() {
    var tmp = new active(this.dna);
    return tmp;
  }*/
