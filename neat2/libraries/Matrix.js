function Matrix(r_, c_) {
   //-------- CONSTRUCTOR ---------
   this.rows = r_ || 1;
   this.cols = c_ || 1;
   this.vals = [];

   for (var r = 0; r < this.rows; r++) {
      this.vals[r] = [];
      for (var c = 0; c < this.cols; c++) {
         this.vals[r][c] = 0;
      }
   }
}

//-------- USEFUL FUNCTIONS ---------

//SIGMOID SQUASH FUNCTION 
Matrix.sigmoid = function (n_) {
   return 1 / (1 + Math.exp(n_ * -1));
}

//MUTATE
Matrix.prototype.mutate = function (tech, mr) {
   var id = false;
   switch (tech) {
      case 0:
         for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
               if (Math.random() < mr) {
                  this.vals[i][j] += (Math.random() - 0.5) / 5;
                  if (this.vals[i][j] < -1) this.vals[i][j] = -1;
                  if (this.vals[i][j] > 1) this.vals[i][j] = 1;
                  id = true;
               }
            }
         }
         break;
      case 1:
         for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
               if (Math.random() < mr) {
                  this.vals[i][j] = (Math.random() - 0.5) * 3;
               }
            }
         }
   }
   return id;
}

Matrix.prototype.cross = function (other, tech) {
   var a = this.copy();
   var b = other;
   switch (tech) {
      case 0:
         var pointX = random(a.rows);
         for (var i = 0; i < a.rows; i++) {
            if (i > pointX) {
               a.vals[i] = b.vals[i].slice(0);
            }
         }
         break;
      case 1:
         var pointX = random(a.rows);
         var pointY = random(a.cols);
         for (var i = 0; i < a.rows; i++) {
            for (var j = 0; j < a.cols; j++) {
               if (i > pointX && j > pointY) a.vals[i][j] = b.vals[i][j];
            }
         }
         break;
      case 2:
         for (var i = 0; i < a.rows; i++) {
            if (Math.random() < 0.5) a.vals[i] = b.vals[i].slice(0);
            for (var j = 0; j < a.cols; j++) {
               if (Math.random() < 0.5) a.vals[i][j] = b.vals[i][j];
            }
         }
         break;
   }
   return a.size();
}

//-------- MATRIX FUNCTIONS ---------

//DO FUNCTION OVER ALL ELEMENTS
Matrix.prototype.do = function (f) {
   for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
         this.vals[r][c] = f(this.vals[r][c], r, c);
      }
   }
   return this;
}

Matrix.do = function (m_, f) {
   for (var r = 0; r < m_.rows; r++) {
      for (var c = 0; c < m_.cols; c++) {
         m_.vals[r][c] = f(m_.vals[r][c], r, c);
      }
   }
   return m_;
}

//UPDATE SIZE 
Matrix.prototype.size = function () {
   this.rows = this.vals.length;
   this.cols = this.vals[0].length;
   return this;
}

//CONVERT FROM AND TO ARRAY
Matrix.fromArray = function (arr_) {
   var tmp = new Matrix(arr_.length, 1);
   for (var r = 0; r < tmp.rows; r++) {
      tmp.vals[r][0] = arr_[r];
   }
   return tmp.size();
}

Matrix.toArray = function (m_) {
   var arr = [];
   m_.do(val => arr.push(val));
   return arr;
}

Matrix.prototype.toArray = function () {
   var arr = [];
   this.do(val => arr.push(val));
   return arr;
}

//RANDOMIZE
Matrix.prototype.randomize = function (s_, e_) {
   if (s_ && !e_) {
      e_ = s_;
      s_ = 0;
   } else if (!s_ && !e_) {
      s_ = 0;
      e_ = 1;
   }
   this.do((val, r, c) => Math.random() * (e_ - s_) + s_);
   return this;
}

Matrix.randomize = function (m_, s_, e_) {
   if (s_ && !e_) {
      e_ = s_;
      s_ = 0;
   } else if (!s_ && !e_) {
      s_ = 0;
      e_ = 1;
   }
   m_.do((val, r, c) => Math.random() * (e_ - s_) + s_);
   return m_;
}

//EMPTY THE MATRIX
Matrix.prototype.empty = function () {
   this.do(() => 0);
   return this;
}

Matrix.empty = function (m_) {
   m_.do(() => 0);
   return m_;
}

//MAKE A COPY OF THE MATRIX
Matrix.prototype.copy = function () {
   var n = new Matrix(this.rows, this.cols);
   var tmp = [];
   for (var x of this.vals) {
      tmp.push(x.slice(0));
   }
   n.vals = tmp;
   return n.size();
}

Matrix.copy = function (m_) {
   var n = new Matrix(m_.rows, m_.cols);
   var tmp = [];
   for (var x of m_.vals) {
      tmp.push(x.slice(0));
   }
   n.vals = tmp;
   return n.size();
}

//PRINT TO CONSOLE
Matrix.prototype.print = function () {
   console.table(this.vals);
}

//-------- MATRIX OPERATIONS ---------

//TRANSPOSE 
Matrix.transpose = function (m) {
   var res = new Matrix(m.cols, m.rows);
   res.do((val, r, c) => m.vals[c][r]);
   return res.size();
}

Matrix.prototype.transpose = function () {
   var res = new Matrix(this.cols, this.rows);
   res.do((val, r, c) => this.vals[c][r]);
   this.vals = res.vals;
   return this.size();
}

//ADD 
Matrix.prototype.add = function (n_) {
   if (n_ instanceof Matrix) {
      if (this.rows === n_.rows && this.cols === n_.cols) return this.do((val, r, c) => val + n_.vals[r][c]);
      else return undefined;
   } else return this.do(val => val + n_);
}

Matrix.add = function (m_, n_) {
   if (n_ instanceof Matrix) {
      if (m_.rows === n_.rows && m_.cols === n_.cols) return m_.do((val, r, c) => val + n_.vals[r][c]);
      else return undefined;
   } else return m_.do(val => val + n_);
}

//SUBSTRACT
Matrix.prototype.sub = function (n_) {
   if (n_ instanceof Matrix) {
      if (this.rows === n_.rows && this.cols === n_.cols) return this.do((val, r, c) => val - n_.vals[r][c]);
      else return undefined;
   } else return this.do(val => val - n_);
}

Matrix.sub = function (m_, n_) {
   if (n_ instanceof Matrix) {
      if (m_.rows === n_.rows && m_.cols === n_.cols) return m_.do((val, r, c) => val - n_.vals[r][c]);
      else return undefined;
   } else return m_.do(val => val - n_);
}

//MULTIPLICATE
Matrix.prototype.mult = function (n_) {
   if (n_ instanceof Matrix) {
      if (this.rows === n_.rows && this.cols === n_.cols) return this.do((val, r, c) => val * n_.vals[r][c]);
      else return undefined;
   } else return this.do(val => val * n_);
}

Matrix.mult = function (m_, n_) {
   if (n_ instanceof Matrix) {
      if (m_.rows === n_.rows && m_.cols === n_.cols) return m_.do((val, r, c) => val * n_.vals[r][c]);
   } else return m_.do(val => val * n_);
}

//POWER
Matrix.prototype.pow = function (n_) {
   if (n_ instanceof Matrix) {
      if (this.rows === n_.rows && this.cols === n_.cols) return this.do((val, r, c) => Math.pow(val, n_.vals[r][c]));
      else return undefined;
   } else return this.do(val => Math.pow(val, n_));
}

Matrix.pow = function (m_, n_) {
   if (n_ instanceof Matrix) {
      if (m_.rows === n_.rows && m_.cols === n_.cols) return m_.do((val, r, c) => Math.pow(val, n_.vals[r][c]));
   } else return m_.do(val => Math.pow(val, n_));
}

//DOT PRODUCT 
Matrix.prototype.dot = function (n_) {
   if (this.cols === n_.rows) {
      var res = new Matrix(this.rows, n_.cols);
      res.do((val, r, c) => {
         var sum = 0;
         for (var k = 0; k < this.cols; k++) {
            sum += this.vals[r][k] * n_.vals[k][c];
         }
         return sum;
      });
      this.vals = res.vals;
      return this.size();
   } else return undefined;
}

Matrix.dot = function (n1_, n2_) {
   if (n1_.cols == n2_.rows) {
      var res = new Matrix(n1_.rows, n2_.cols);
      for (var r = 0; r < res.rows; r++) {
         for (var c = 0; c < res.cols; c++) {
            var sum = 0;
            for (var k = 0; k < n1_.cols; k++) {
               sum += n1_.vals[r][k] * n2_.vals[k][c];
            }
            res.vals[r][c] = sum;
         }
      }
      return res;
   } else return undefined;
}

//SUM OF ALL ELEMENETS
Matrix.prototype.sum = function () {
   var sum_ = 0;
   this.do(val => {
      sum_ += val;
      return val
   })
   return sum_;
}

Matrix.sum = function (m_) {
   var sum_ = 0;
   m_.do(val => {
      sum_ += val;
      return val
   })
   return sum_;
}
