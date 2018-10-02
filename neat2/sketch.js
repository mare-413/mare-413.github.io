var popu;
var board;

var brain = [16, [8], 4];

var grid = 30;
var square = 10;

var active;

var look = false;

var chartData = [{
   x: [],
   y: []
}];

function setup() {
   createCanvas(grid * square, grid * square);
   rectMode(CENTER, CENTER);
   frameRate(30);

   popu = new Population(700);
   board = new Board(popu.agents[0].dna);

   document.getElementById("b1").addEventListener("click", () => {
      if (look) look = false;
      else look = true;
   });
   document.getElementById("b2").addEventListener("click", () => {
      Plotly.newPlot('chart1', chartData);
   });
}

function draw() {
   background(0);

   if (look) {
      show(board);
      board.changeDir();
      if (!board.run()) {
         board = new Board(popu.universalDna);
      }
   } else {
      popu.run();
      chartData[0].x.push(popu.generation);
      chartData[0].y.push(popu.localScore);
      document.getElementById("p1").innerHTML = "Sum: " + popu.sum + " | LocalFit: " + popu.localFitness + " | BestFitness: " + popu.universalFitness + " | Gen: " + popu.generation;
      document.getElementById("p2").innerHTML = "CurScore: " + popu.localScore + " | BestScore: " + popu.bestScore + " | MutRate: " + popu.set.mr + " | Set: " + popu.set.cross + "-" + popu.set.mut;
   }
}

function show(b_) {
   active = b_;
   stroke(0);
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

   fill(255);
   text(b_.frames + " - " + b_.lifetime + " - " + b_.score, 50, height - 20)
}

function keyPressed() {
   if (keyCode == UP_ARROW) popu.set.mr *= 2;
   if (keyCode == DOWN_ARROW) popu.set.mr /= 2;
}

function loadSnake(obj_) {
   var n = new NeuralNet();

   n.lr = obj_.lr;
   n.id = obj_.id;
   n.num_neurons = obj_.num_neurons.slice();

   //layer 0 
   var l = new Layer(obj_.layers[0].num_neurons, obj_.layers[0].prev, obj_.layers[0].next, false);

   l.weights = new Matrix(obj_.layers[0].weights.rows, obj_.layers[0].weights.cols);
   var b = l.weights.vals;
   obj_.layers[0].weights.vals.forEach((v, i) => v.forEach((vv, ii) => b[i][ii] = vv));

   l.bias = new Matrix(obj_.layers[0].bias.rows, obj_.layers[0].bias.cols);
   b = l.bias.vals;
   obj_.layers[0].bias.vals.forEach((v, i) => v.forEach((vv, ii) => b[i][ii] = vv));

   n.layers[0] = l;

   //layer 1
   l = new Layer(obj_.layers[1].num_neurons, obj_.layers[1].prev, obj_.layers[1].next, false);

   l.weights = new Matrix(obj_.layers[1].weights.rows, obj_.layers[1].weights.cols);
   b = l.weights.vals;
   obj_.layers[1].weights.vals.forEach((v, i) => v.forEach((vv, ii) => b[i][ii] = vv));

   l.bias = new Matrix(obj_.layers[1].bias.rows, obj_.layers[1].bias.cols);
   b = l.bias.vals;
   obj_.layers[1].bias.vals.forEach((v, i) => v.forEach((vv, ii) => b[i][ii] = vv));

   n.layers[1] = l;

   return n;
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
