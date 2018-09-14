function NeuralNet(i_, ha_, o_) {
   var num_i = i_;
   var num_h = [num_i];
   if (ha_ instanceof Array) {
      for (var i = 0; i < ha_.length; i++) {
         num_h.push(ha_[i]);
      }
   } else num_h.push(1);
   num_h.push(o_);
   this.num_neurons = num_h;

   this.lr = 0.5;
   this.id = Math.floor(Math.random() * 1000);

   this.layers = [];
   for (var i = this.num_neurons.length - 2; i >= 0; i--) {
      this.layers.push(new Layer(this.num_neurons[i + 1], this.num_neurons[i], this.layers[this.layers.length - 1]));
   }
   this.layers.reverse();
}

NeuralNet.prototype.mutate = function (tech, mr) {
   if (this.layers[0].weights.mutate(tech, mr) || this.layers[0].bias.mutate(tech, mr) || this.layers[1].weights.mutate(tech, mr) || this.layers[1].bias.mutate(tech, mr)) this.id = floor(random(1000));

   return this;
}

NeuralNet.prototype.cross = function (other, tech) {
   var nn = this.copy();

   nn.layers[0].weights = nn.layers[0].weights.cross(other.layers[0].weights, tech);
   nn.layers[0].bias = nn.layers[0].bias.cross(other.layers[0].bias, tech);

   nn.layers[1].weights = nn.layers[1].weights.cross(other.layers[1].weights, tech);
   nn.layers[1].bias = nn.layers[1].bias.cross(other.layers[1].bias, tech);

   nn.id = Math.floor((nn.id + other.id) / 2);

   return nn;
}

NeuralNet.prototype.copy = function () {
   var n = new NeuralNet();

   n.lr = this.lr;
   n.id = this.id;
   n.num_neurons = this.num_neurons.slice();

   var l = new Layer(this.layers[0].num_neurons, this.layers[0].prev, this.layers[0].next, false);
   l.weights = this.layers[0].weights.copy();
   l.bias = this.layers[0].bias.copy();
   n.layers[0] = l;

   l = new Layer(this.layers[1].num_neurons, this.layers[1].prev, this.layers[1].next, false);
   l.weights = this.layers[1].weights.copy();
   l.bias = this.layers[1].bias.copy();
   n.layers[1] = l;

   return n;
}

NeuralNet.prototype.forward = function (arr_i, stop_) {
   var cur = Matrix.fromArray(arr_i);
   var stop = stop_ ? stop_ : this.layers.length;

   for (var i = 0; i < stop; i++) {
      cur = this.layers[i].feed(cur);
   }
   return cur;
}

NeuralNet.prototype.train = function (inp_, tar_) {
   var outputs = this.forward(inp_);
   var inputs = Matrix.fromArray(inp_);
   var targets = Matrix.fromArray(tar_);

   //------- OUTPUT LAYER --------
   var errors = Matrix.sub(targets, outputs);
   var totalE = errors.sum();

   var gradients = outputs.copy().do(x => x * (1 - x));
   gradients.mult(errors);
   gradients.mult(this.lr);

   var hid_out = this.layers[this.layers.length - 2].last_out;
   var deltas = Matrix.dot(gradients, Matrix.transpose(hid_out));

   this.layers[this.layers.length - 1].weights.add(deltas);
   this.layers[this.layers.length - 1].bias.add(gradients);
   //------- OUTPUT LAYER --------

   //------- HIDDEN LAYER --------
   var w_hoT = Matrix.transpose(this.layers[this.layers.length - 1].weights);
   hid_errors = Matrix.dot(w_hoT, errors);

   var gradient = hid_out.copy().do(x => x * (1 - x));
   gradient.mult(hid_errors);
   gradient.mult(this.lr);

   var delta = Matrix.dot(gradient, Matrix.transpose(inputs));

   this.layers[this.layers.length - 2].weights.add(delta);
   this.layers[this.layers.length - 2].bias.add(gradient);
   //------- HIDDEN LAYER --------

   return totalE;
}

function Layer(n_, prev_neurons, next_, init_ = true) {
   this.num_neurons = n_;
   this.prev = prev_neurons;
   this.next = next_ instanceof Layer ? next_ : false;

   if (init_) {
      this.weights = new Matrix(this.num_neurons, this.prev);
      this.weights.randomize(-1.5, 1.5);
      this.bias = new Matrix(this.num_neurons, 1);
      this.bias.randomize(-1.5, 1.5);
   } else {
      this.weights;
      this.bias;
   }
   this.last_out;
}

Layer.prototype.feed = function (i_) {
   var out = Matrix.dot(this.weights, i_);
   out.add(this.bias);
   out.do(Matrix.sigmoid);
   this.last_out = out;
   return out;
}

/*//OUTPUT LAYER
  var layer_out = this.layers[this.layers.length - 1];
  var updates_out = layer_out.weights.copy().empty();
  updates_out.do(v, i, j => (errors.vals[i][0] * -1) * (outputs.vals[i][0] * (1 - outputs.vals[i][0])) * (last_hidden[j]));
  return layer_out.weights.sub(updates_out.mult(0.5));
  //OUTPUT LAYER*/
