// I am going to use a system where a sequence object has two methods:
//
// * next(), which returns a boolean indicating whether there are more
//   elements in the sequence, and moves it forward to the next
//   element when there are.
//
// * current(), which returns the current element, and should only be
//   called after next() has returned true at least once.

function logFive(sequence) {
  for ( var i = 0 ; i < 5 ; i++ ) {
    if (sequence.next()) console.log(sequence.current()); 
    else break;
  }
}

function Sequence(array) {
  this.pos=-1;
  this.array = array;
}
Sequence.prototype.next = function() {
  if (this.pos >= this.array.length-1) return false;
    this.pos++;
    return true
};
Sequence.prototype.current = function() {
  return this.array[this.pos];
};

function ArraySeq(array) {
  Sequence.call(this, array);
}
ArraySeq.prototype = Object.create(Sequence.prototype);

function RangeSeq(from, to) {
  array = [];

  for (var i = 0; i < to; i++) {
    array[i]=from+i;

  }
  Sequence.call(this, array);
}
RangeSeq.prototype = Object.create(Sequence.prototype);

logFive(new ArraySeq([1,2,3]));
logFive(new RangeSeq(1,1000));

