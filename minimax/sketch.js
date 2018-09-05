var viewer;
var selectedR;
var selectedA;
var count = 0;

function setup() {
  createCanvas(500, 400);
  viewer = new Viewer();
}

function draw() {
  background(41, 40, 48);
  viewer.show();
  
  if (viewer.player == 1 && frameCount % 40 == 0) {
    var a = new Node(viewer.data, true, 0, false);
    viewer.data = Tree.pushScore(a).data;
    viewer.player = viewer.player === 1 ? 0 : 1;
    viewer.ended();
  }
}

function Viewer() {
  this.data = [3, 5, 7];
  this.player = 0;
  this.done = false;

  this.move = function(row_, amm_) {
    if (this.data[row_ - 1] === 0 || this.data[row_ - 1] < amm_) return print("Invalid input: (" + row_ + ", " + amm_ + ").");
    this.data[row_ - 1] -= amm_;
    if (this.data[row_ - 1] < 0) this.data[row_ - 1] = 0;
    this.player = this.player === 1 ? 0 : 1;
    this.ended();
  }

  this.ended = function() {
    if (this.data[0] + this.data[1] + this.data[2] <= 1) {
      this.done = true;
    }
  }

  this.show = function() {
    textSize(25);
    fill(255, 174, 126);
    text("Turn: " + (viewer.player === 1 ? "AI" : "HuMaN"), 53, 50);
    var size = 25;
    strokeWeight(5);
    selectedA = floor(mouseX / (width / 8));
    for (var i = 1; i <= 3; i++) {
      if (i <= selectedA && selectedR === 1) stroke(252, 114, 75);
      else stroke(65, 76, 78);
      fill(i - 1 < viewer.data[0] ? color(243, 236, 226) : (65, 76, 78));
      ellipse(width / 8 * i, 100, size, size);
    }
    for (var i = 1; i <= 5; i++) {
      if (i <= selectedA && selectedR === 2) stroke(252, 114, 75);
      else stroke(65, 76, 78);
      fill(i - 1 < viewer.data[1] ? (243, 236, 226) : (65, 76, 78));
      ellipse(width / 8 * i, 200, size, size);
    }
    for (var i = 1; i <= 7; i++) {
      if (i <= selectedA && selectedR === 3) stroke(252, 114, 75);
      else stroke(65, 76, 78);
      fill(i - 1 < viewer.data[2] ? (243, 236, 226) : (65, 76, 78));
      ellipse(width / 8 * i, 300, size, size);
    }
    noStroke();
    /*
    fill(252, 114, 75);
    triangle(25, selectedR * 100, 15, selectedR * 100 - 10, 15, selectedR * 100 + 10);
    */
    if (mouseY < 150) selectedR = 1;
    else if (mouseY < 250) selectedR = 2;
    else if (mouseY < 300) selectedR = 3;

    if (viewer.done) {
      textSize(30);
      fill(252, 114, 75);
      text("Winner player " + (!viewer.player == true ? "AI" : "Human"), 53, 370);
    }
  }
}

function mousePressed() {
  viewer.move(selectedR, selectedA);
}