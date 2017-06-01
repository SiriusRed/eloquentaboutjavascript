function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Object.defineProperty(Vector.prototype, "length", {
  get: function() {
    return Math.hypot(this.x, this.y);
  }
});

Vector.prototype.plus = function(vector) {
  return new Vector(this.x + vector.x, this.y + vector.y);
}

Vector.prototype.minus = function(vector) {
  return new Vector(this.x - vector.x, this.y - vector.y);
}

console.log(new Vector(1, 2).plus(new Vector(2, 3)));
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
var vector = new Vector(3,4);
console.log(vector.length);