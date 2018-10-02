function Population(a_) {
   this.set = {
      mr: 0.01,
      cross: 1,
      mut: 0,
      elite: 1,
      innovation: 0
   }

   this.size = a_;

   this.universalDna;
   this.localFitness = 0;
   this.universalFitness = 0;
   this.bestScore = 0;
   this.localScore = 0;

   this.generation = 0;
   this.sum = 0;

   this.spw = [];

   this.agents = [];
   for (var i = 0; i < a_; i++) {
      var b = new NeuralNet(...brain);
      var n = new Board(b);
      this.agents.push(n);
   }

   this.run = function () {
      for (var i = 0; i < this.agents.length; i++) {
         while (true) {
            this.agents[i].changeDir();
            if (!this.agents[i].run()) break;
         }
      }

      //-------- FITNESS ---------

      this.sum = this.rate();

      //-------- CROSSOVER ---------
      var newpopulation = this.crossover(this.set.cross);


      //-------- MUTATION ---------
      this.mutation(newpopulation, this.set.mut, this.set.mr);

      //-------- NEW POPULATION ---------  
      this.agents = newpopulation;
      this.generation++;

      return this.sum;
   }
}

Population.prototype.rate = function () {
   this.localFitness = 0;
   this.localScore = 0;

   var sum = 0;
   for (var i = 0; i < this.agents.length; i++) {
      var f = this.agents[i].evaluate();
      sum += f;
      if (this.agents[i].score > this.bestScore) this.bestScore = this.agents[i].score;
      if (this.agents[i].score > this.localScore) this.localScore = this.agents[i].score;
      if (f > this.localFitness) this.localFitness = f;
      if (f > this.universalFitness) {
         this.universalFitness = f;
         this.universalDna = this.agents[i].dna;
      }
   }
   return sum;
}

Population.prototype.crossover = function (tech) {
   var newpopu = [];
   if (this.spw.length) {
      for (var i = 0; i < this.spw.length; i++) {
         var n = new Board(this.spw[i]);
         newpopu.push(n);
      }
   }
   if (this.universalDna && this.set.elite) {
      var n = new Board(this.universalDna.copy());
      newpopu.push(n);
   }
   for (var i = 0; i < this.size / 100 * this.set.innovation; i++) {
      var b = new NeuralNet(...brain);
      n = new Board(b);
      newpopu.push(n);
   }
   let tmp = this.size - newpopu.length;
   for (var j = 0; j < tmp; j++) {
      let dad = this.pick(this.agents).dna;
      let mom = this.pick(this.agents).dna;
      let child = dad.cross(mom, tech);
      child = new Board(child);
      newpopu.push(child);
   }
   return newpopu;
}

Population.prototype.mutation = function (popu, tech, mr) {
   for (var i = 0; i < popu.length; i++) {
      popu[i].dna.mutate(tech, mr);
   }
}

Population.prototype.pick = function (list_) {
   /*var list = [];
   list_.every(v => list.push(v.fitness));
   var a;
   var b = max(list);
   while (true) {
      a = Math.floor(random(list.length));
      if (random(1) < list[a] / b) return list_[a];
   }*/
   var p = floor(random(this.sum));
   var cumulative = 0;
   for (var i = 0; i < list_.length; i++) {
      cumulative += list_[i].fitness;
      if (cumulative > p) {
         //print("i: " + i + " - f: " + list[i].fitness);
         return list_[i];
      }
   }
   return null;
}

Population.prototype.spawn = function (snk) {
   this.spw.push(loadSnake(snk));
}
