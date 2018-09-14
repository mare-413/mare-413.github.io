function Tree() {
  this.root = new Node([3, 5, 7], true, 0, false);
}

Tree.ended = function(state_) {
  if (state_[0] + state_[1] + state_[2] <= 1) return true;

  /*
  if (viewer.data[0] + viewer.data[1] + viewer.data[2] >= 14) {
    if (state_[0] === 0) {
      if (state_[1] === state_[2] && state_[1] > 1) return true;
    }
    if (state_[1] === 0) {
      if (state_[0] === state_[2] && state_[0] > 1) return true;
    }
    if (state_[2] === 0) {
      if (state_[0] === state_[1] && state_[0] > 1) return true;
    }
  }*/

  return false;
}

Tree.getPosStates = function(data_) {
  var sp = data_.slice();
  var states = [];
  for (var i = 0; i < sp.length; i++) {
    for (var j = sp[i]; j > 0; j--) {
      var tmp = sp.slice();
      tmp[i] -= j;
      states.push(tmp);
    }
  }
  return states;
}

Tree.pushScore = function(node_) {
  for (var i = 0; i < node_.childs.length; i++) {
    if (!node_.childs[i].end) Tree.pushScore(node_.childs[i]);
  }
  var bestChildScore;
  var bestChildIndex;
  if (node_.max) {
    var big = -Infinity;
    var index;
    for (var i = 0; i < node_.childs.length; i++) {
      if (node_.childs[i].score > big) {
        big = node_.childs[i].score;
        index = i;
      }
    }
    bestChildScore = big;
    bestChildIndex = index;
  } else {
    var small = Infinity;
    var index;
    for (var i = 0; i < node_.childs.length; i++) {
      if (node_.childs[i].score < small) {
        small = node_.childs[i].score;
        index = i;
      }
    }
    bestChildScore = small;
    bestChildIndex = index;
  }
  node_.score = bestChildScore;
  return node_.childs[bestChildIndex];
}

function Node(data_, max_, player_, parent_) {
  this.data = data_;
  this.max = max_;
  this.player = player_;
  this.parent = parent_;
  this.end = Tree.ended(this.data) ? true : false;
  this.score = this.end ? (this.player === 0 ? -10 : 10) : 0;
  this.childs = [];
  if (!this.end) {
    var sts = Tree.getPosStates(this.data);
    for (var i = 0; i < sts.length; i++) {
      if (sts[i].every(v => v == 0)) continue;
      this.childs.push(new Node(sts[i], !this.max, this.player === 0 ? 1 : 0, this));
      count++;
    }
  }
}