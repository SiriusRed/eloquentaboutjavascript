var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

function Vector(x,y) {
    this.x=x;
    this.y=y;
}

Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

function Grid (width, height) {
    this.space = new Array(width*height);
    this.width = width;
    this.height = height;
}

Grid.prototype.isInside = function(vector) {
    return (vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height);
}

Grid.prototype.get = function(vector) {
    return this.space[vector.x + (vector.y * this.width)]
}

Grid.prototype.set = function(vector, value) {
    this.space[vector.x + (vector.y * this.width)] = value;
}

var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function BouncingCritter() {
    this.direction = randomElement(Object.keys(directions));
}

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ") //  view.look - return Object from direction
        this.direction = view.find(" ") || "s"; // view.find - return direction for object //  view.findAll - return array with all directions for object
    return {type: "move", direction: this.direction};
}


function elementFromChar(legend, ch) {
    if (ch == " " || legend[ch] == undefined || !legend[ch] instanceof Function)// Дополнительно проверяем соответствует ли символ представленным свойства в объекте legend и является ли он конструктором
        return null;
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
}

function charFromElement(element) {
    return element == null ? " " : element.originChar;
}

Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};

// Map - двухмерный массив, типа plan
// Legent - объект, предоставляеющий соответствие символов на карте объектам, типа {"#": Wall, "o": BouncingCritter}
function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function(line,y) {
        for (var x=0; x<line.length; x++) { // Перебираем символы из массива плана. Вектор с заданными координатами превращаем в индекс одномерного массива элементов в мире.
            grid.set(new Vector(x,y), elementFromChar(legend, line[x])); // - ??? Спросить у Саши К. // Каждому символу на карте соответствует объект в объекте legend. В каждый элемент массива мира сетим объект.
        }
    });
}

World.prototype.toString = function() {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
        for(var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x,y));
            output += charFromElement(element);
        }
        output += "\n";
    }
    for (obj in this.legend) output += obj + " - " + this.legend[obj].name + "\n";
    return output;
}

function Wall() {}

var HelloWorld = new World(plan,{"#": Wall, "o": BouncingCritter})
console.log(HelloWorld.toString());
