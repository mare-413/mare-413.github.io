var numbers = [];
var fixed = [];

var curX = 0;
var curY = 0;

var done = false;

function setup() {
   createCanvas(335, 335);
   textAlign(CENTER, CENTER)
   for (var i = 0; i < 9; i++) {
      numbers[i] = [];
      fixed[i] = [];
      for (var j = 0; j < 9; j++) {
         numbers[i][j] = 0;
         fixed[i][j] = false;
      }
   }
   numbers[0][2] = 1;
   numbers[0][3] = 8;
   numbers[0][7] = 9;
   numbers[1][1] = 3;
   numbers[1][5] = 5;
   numbers[2][2] = 2;
   numbers[2][4] = 3;
   numbers[2][6] = 4;
   numbers[3][5] = 4;
   numbers[3][6] = 7;
   numbers[3][7] = 2;
   numbers[4][2] = 7;
   numbers[4][4] = 9;
   numbers[4][7] = 1;
   numbers[5][1] = 9;
   numbers[5][2] = 8;
   numbers[5][3] = 5;
   numbers[5][1] = 9;
   numbers[6][3] = 7;
   numbers[7][1] = 7;
   numbers[7][2] = 4;
   numbers[7][5] = 2;
   numbers[7][6] = 6;
   numbers[8][4] = 6;
   numbers[8][6] = 2;
   numbers[8][7] = 5;
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         if (numbers[i][j]) fixed[i][j] = true;
      }
   }

   //-------------------------------------------------------------------------
}

function draw() {
   background(252, 255, 204);
   noFill();
   for (var i = 0; i < 10; i++) {
      strokeWeight(1);
      if (i % 3 == 0) strokeWeight(3);
      line(i * 37, 0, i * 37, height);
      line(0, i * 37, width, i * 37);
   }

   textSize(20);
   for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
         fill(fixed[j][i] ? 0 : color(50, 80, 131));
         text(numbers[j][i] ? numbers[j][i] : "", 18.5 + i * 37, 18.5 + j * 37);
      }
   }

   if (!done)
      for (var i = 0; i < 1000; i++)
         if (next()) {
            done = true;
            break;
         }
}

function check(n_, i_, j_) {
   for (var i = 0; i < 9; i++) {
      if (numbers[i_][i] === n_ && i !== j_) return false;
      if (numbers[i][j_] === n_ && i !== i_) return false;
   }
   var sector = [floor(i_ / 3) * 3, floor(j_ / 3) * 3];
   for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
         if (numbers[sector[0] + i][sector[1] + j] === n_ && sector[0] + i !== i_ && sector[1] + j !== j_) return false;
      }
   }
   return true;
}

function put(n_, i_, j_) {
   if (fixed[i_][j_]) return;
   numbers[i_][j_] = n_;
}

function ret(i_, j_) {
   return numbers[i_][j_];
}

function next() {
   var count = ret(curX, curY);
   count = count ? count + 1 : 1;
   if (count > 9) {
      put(0, curX, curY);
      back();
      return;
   }
   put(count, curX, curY);
   if (!check(count, curX, curY)) return;
   //--------------------------
   if (forward()) return true;
}

function forward() {
   curY++;
   if (curY > 8) {
      curX++;
      curY = 0;
   }
   if (curX > 8) {
      console.log("FINISHED - SOLVED!");
      curX = 8;
      console.table(numbers);
      return true;
   }
   if (fixed[curX][curY]) forward();
   return;
}

function back() {
   curY--;
   if (curY < 0) {
      curX--;
      curY = 8;
   }
   if (curX < 0) {
      console.log("FINISHED - NO SOLUTION");
      curX = 0;
      return true;
   }
   if (fixed[curX][curY]) back();
   return;
}

function keyPressed() {
   next();
}







///
