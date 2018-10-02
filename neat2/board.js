function Board(nn) {
   this.dna = nn;
   this.snake = [];
   this.score = 1;
   this.fitness = 0;
   this.lifetime = 0;
   this.frames = 0;
   this.lost = false;
   this.head = {
      x: 15,
      y: 15,
      nx: 1,
      ny: 0
   };
   this.snake.push(this.head);
   for (var i = 1; i < 5; i++) {
      var p = this.snake[i - 1];
      this.snake[i] = {
         x: p.x - p.nx,
         y: p.y - p.ny,
         nx: p.nx,
         ny: p.ny
      }
   }
   this.food = {
      x: floor(random(1, grid)),
      y: floor(random(1, grid))
   };
}

Board.prototype.run = function () {
   for (var i = this.snake.length - 1; i >= 0; i--) {
      this.snake[i].x += this.snake[i].nx;
      this.snake[i].y += this.snake[i].ny;
      if (i > 0) {
         this.snake[i].nx = this.snake[i - 1].nx;
         this.snake[i].ny = this.snake[i - 1].ny;
      }
   }
   //WALL COLLISION
   if (this.head.x < 0 || this.head.x >= grid || this.head.y < 0 || this.head.y >= grid) {
      this.lost = true;
      return false;
   } else {
      //------ BODY COLLISION ------
      for (var i = 1; i < this.snake.length; i++) {
         if (this.head.x === this.snake[i].x && this.head.y === this.snake[i].y) {
            this.lost = true;
            return false;
         }
      }
   }
   //------- FOOD EAT ------
   if (this.head.x === this.food.x && this.head.y === this.food.y) {
      this.ufood();
      this.grow();
      this.score++;
      this.frames = 0;
   }

   this.lifetime++;
   this.frames++;
   if (this.frames > 150) {
      this.lost = true;
      return false;
   }
   return true;
}

Board.prototype.ufood = function () {
   this.food.x = floor(random(1, grid));
   this.food.y = floor(random(1, grid));
   for (var i = 0; i < this.snake.length; i++) {
      if (this.snake[i].x === this.food.x && this.snake[i].y === this.food.y) {
         return this.ufood();
      }
   }
}

Board.prototype.grow = function () {
   var p = this.snake[this.snake.length - 1];
   this.snake.push({
      x: p.x - p.nx,
      y: p.y - p.ny,
      nx: p.nx,
      ny: p.ny
   });
}

Board.prototype.changeDir = function () {
   var out = this.dna.forward(this.inputs()).toArray();
   out = out.indexOf(Math.max(...out));
   switch (out) {
      case 0:
         if (this.head.nx == 0 && this.head.ny == 1) break;
         this.head.nx = 0;
         this.head.ny = -1;
         break;
      case 1:
         if (this.head.nx == -1 && this.head.ny == 0) break;
         this.head.nx = 1;
         this.head.ny = 0;
         break;
      case 2:
         if (this.head.nx == 0 && this.head.ny == -1) break;
         this.head.nx = 0;
         this.head.ny = 1;
         break;
      case 3:
         if (this.head.nx == 1 && this.head.ny == 0) break;
         this.head.nx = -1;
         this.head.ny = 0;
         break;
   }
}

Board.prototype.inputs = function () {
   var inputs = new Array(8);
   var h = this.head;
   //-------- SNAKE BODY ---------
   inputs.fill(Infinity);
   for (var i = 1; i < this.snake.length; i++) {
      var s = this.snake[i];
      var [nx, ny] = [s.x - h.x, h.y - s.y];
      var [ax, ay] = [Math.abs(nx), Math.abs(ny)];
      if (nx == 0) {
         if (ny < 0) inputs[4] = ay < inputs[4] ? ay : inputs[4];
         else inputs[0] = ay < inputs[0] ? ay : inputs[0];
      }
      if (ny == 0) {
         if (nx > 0) inputs[2] = ax < inputs[2] ? ax : inputs[2];
         else inputs[6] = ax < inputs[6] ? ax : inputs[6];
      }
      if (nx == ny) {
         if (ny > 0) inputs[1] = ax < inputs[1] ? ax : inputs[1];
         else inputs[5] = ax < inputs[5] ? ax : inputs[5];
      }
      if (-nx == ny) {
         if (ny > 0) inputs[7] = ax < inputs[7] ? ax : inputs[7];
         else inputs[3] = ax < inputs[3] ? ax : inputs[3];
      }
   }
   inputs.forEach((v, i) => inputs[i] = v == Infinity ? 0 : 1 / v);
   //-------- WALL BLOCK ---------
   inputs.push(1 / h.x);
   inputs.push(1 / (grid - 1 - h.x));
   inputs.push(1 / h.y);
   inputs.push(1 / (grid - 1 - h.y));
   //-------- FOOD BLOCK ---------
   var [fx, fy] = [h.x - this.food.x, h.y - this.food.y];
   inputs.push((fy > 0 ? 1 / fy : 0));
   inputs.push((fx < 0 ? 1 / Math.abs(fx) : 0));
   inputs.push((fy < 0 ? 1 / Math.abs(fy) : 0));
   inputs.push((fx > 0 ? 1 / fx : 0));
   return inputs;
}

Board.prototype.evaluate = function (tr_ = false) {
   if (!tr_) this.fitness = (this.lifetime * this.lifetime * (this.score * this.score * 2)) / 2;
   else this.fitness = this.score * this.score * 2;
   return this.fitness;
}
