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
    this.turnNumber = 0;

    map.forEach(function(line,y) {
        for (var x=0; x<line.length; x++)  // Перебираем символы из массива плана. Вектор с заданными координатами превращаем в индекс одномерного массива элементов в мире.
            grid.set(new Vector(x,y), 
                    elementFromChar(legend, line[x])); // - ??? Спросить у Саши К. // Каждому символу на карте соответствует объект в объекте legend. В каждый элемент массива мира сетим объект.
    },this);
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
    output += "Turn # " + this.turnNumber;
    return output;
}

World.prototype.turn = function() {
    var acted = [];
    this.grid.forEach(function(critter, vector) {
        if (critter.act && acted.indexOf(critter) == -1) {
            acted.push(critter);
            this.letAct(critter, vector);
        }
    }, this);
    this.turnNumber+=1;
}

World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move") {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
    }
  }
};


World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest))
            return dest;
    }
};

function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    return this.world.grid.isInside(target) ? charFromElement(this.world.grid.get(target)) : "#" ;
};

View.prototype.findAll = function(ch) {
    var found = [];
    for (dir in directions) 
        if (this.look(dir) == ch) found.push(dir);
    return found;
};

View.prototype.find = function(ch) {
    var found = this.findAll(ch);
    if (found.length == 0) return null;
    return randomElement(found);
};


Wall = function() {}

function BouncingCritter() {
    this.direction = randomElement(Object.keys(directions));
}

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) != " ") //  view.look - return Object from direction
        this.direction = view.find(" ") || "s"; // view.find - return direction for object //  view.findAll - return array with all directions for object
    return {type: "move", direction: this.direction};
}

//     0"n"
//  7"nw" 1"ne"
//6"w"       2"e"
//  5"sw" 3"se"
//     4"s" 

var directionNames = Object.keys(directions);

function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index+n+8)%8];
}

function WallFollower() {
  
  this.dir = "s";
}

WallFollower.prototype.act = function(view) {
    var start = this.dir;
    if(view.look(dirPlus(this.start, -3)) != " ")
      start = this.dir = dirPlus(this.dir, -3)
    while (view.look(this.dir) != " ") {
        this.dir = dirPlus(this.dir, 1);
        if (this.dir == start ) break;
    }
    return {type: "move", direction: this.dir};
};


function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
}

LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function (critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter,
                                  vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
};

actionTypes.grow = function(critter) {
    critter.energy += 0.5;
    return true;
}

actionTypes.move = function(critter, vector, action) {
    var dest = this.checkDestination(action, vector)
    if (dest == null || critter.energy <= 1 || this.grid.get(dest) != null) return false;
    critter.energy -= 1;
    this.grid.set(vector, null);
    this.grid.set(dest, critter);
    return true;
};

actionTypes.eat = function(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    var atDest = dest != null && this.grid.get(dest);
    if (!atDest || atDest.energy == null) return false;
    critter.energy += atDest.energy;
    this.grid.set(dest, null);
    return true;
};

actionTypes.reproduce = function(critter, vector, action) {
    var baby = elementFromChar(this.legend,
                             critter.originChar);
    var dest = this.checkDestination(action, vector);
    if (dest == null || critter.energy <= 2 * baby.energy || this.grid.get(dest) != null ) return false;
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
};

function Plant() {
    this.energy = 3 + Math.random() * 4;
}


Plant.prototype.act = function(context) {
  if (this.energy > 15) {
    var space = context.find(" ");
    if (space)
      return {type: "reproduce", direction: space};
  }
  if (this.energy < 20)
    return {type: "grow"};
};


function PlantEater() {
    this.energy = 20;
}

PlantEater.prototype.act = function(context) {
    var space = context.find(" ");
    if (this.energy > 60 && space) return {type: "reproduce", direction: space};
    var plant = context.find("*");
    if (plant) return {type: "eat", direction: plant};
    if (space) return {type: "move", direction: space};
};

var valley = new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****     ###***       *###",
   "############################"],
  {"#": Wall,
   "O": PlantEater,
   "*": Plant}
);

for (var i = 0; i < 5; i++) {
    valley.turn();
    console.log(valley.toString());
}

