Object.prototype.testProto = "testValue"

function Rabbit(type) {
  this.type = type;
}

Rabbit.prototype.speak = function(line) {
  console.log("The " + this.type + " rabbit says '" +
              line + "'");
};

var testObject = new Object();
var killerRabbit = new Rabbit("killer");
var blackRabbit = new Rabbit("black");

console.log(Object.getOwnPropertyNames(Rabbit.prototype));
// → truegit push --set-upstream origin master