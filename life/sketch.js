var winSize = 60;
var cellSize = 8;
var cells = [];
var nextg = [];
var gen = 0;
var runn = false;

function setup() {
  createCanvas(winSize * cellSize + winSize + 1, winSize * cellSize + winSize + 1);
  frameRate(25);
  for (var a = 0; a < winSize; a++) {
    cells[a] = [];
    for (var b = 0; b < winSize; b++) {
      cells[a][b] = new Cell(a * (cellSize + 1) + 6, b * (cellSize + 1) + 6);
    }
  }
}

function draw() {
  background(50);
  for (var a = 0; a < winSize; a++) {
    for (var b = 0; b < winSize; b++) {
      cells[a][b].show();
    }
  }
  if (runn) {
    run();
  }

}

function Cell(a, b) {
  this.x = a;
  this.y = b;
  this.clr = 0;
  this.ckd = false;
  this.ck = 0;

  this.show = function() {
    rectMode(CENTER);
    noStroke();
    fill(this.clr);
    rect(this.x, this.y, cellSize, cellSize);

    if (this.ckd) {
      this.ck = 1;
    } else this.ck = 0;

  }

  this.chk = function() {
    if (this.ckd) {
      this.ckd = false;
    } else this.ckd = true;

    if (this.ckd) {
      this.clr = 255;
    } else this.clr = 0;
  }
}

function mousePressed() {
  for (var a = 0; a < winSize; a++) {
    for (var b = 0; b < winSize; b++) {
      if (mouseX >= cells[a][b].x - cellSize / 2 && mouseX <= cells[a][b].x - cellSize / 2 + cellSize && mouseY >= cells[a][b].y - cellSize / 2 && mouseY <= cells[a][b].y - cellSize / 2 + cellSize) {
        console.log("clicked " + a + ", " + b + " at " + cells[a][b].x + ", " + cells[a][b].y);
        cells[a][b].chk();
      }
    }
  }
}

function run() {
  gen++;
  for (var a = 1; a < winSize - 1; a++) {
    for (var b = 1; b < winSize - 1; b++) {

      if (cells[a][b].ckd == false) {
        if (clcn(a, b) == 3) {
          nextg.push({
            a: a,
            b: b
          });
        }
      }
      if (cells[a][b].ckd == true) {
        if (clcn(a, b) < 2 || clcn(a, b) > 3) {
          nextg.push({
            a: a,
            b: b
          });
        }
      }

    }
  }
  popl = cells.length;
  for (var a = 0; a < nextg.length; a++) {
    cells[nextg[a].a][nextg[a].b].chk();
  }
  nextg.length = 0;
  //run();
}

function clcn(a, b) {
  var neighbors = 0;
  for (var c = -1; c <= 1; c++) {
    for (var d = -1; d <= 1; d++) {
      neighbors += cells[a + c][b + d].ck;
    }
  }
  neighbors -= cells[a][b].ck;
  return neighbors;
}

function generate() {
  for (var a = 1; a < winSize - 1; a++) {
    for (var b = 1; b < winSize - 1; b++) {
      if (random(0, 1) < 0.2) {
        cells[a][b].chk();
      }
    }
  }
}

function keyPressed() {
  if (key === " ") {
    if (runn) {
      runn = false;
    } else runn = true;
  } else if (key === "G") {generate();
}}