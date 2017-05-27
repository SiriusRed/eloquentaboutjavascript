var ANCESTRY_FILE  = require("./05_data.js");

var ancestry = JSON.parse(ANCESTRY_FILE);

// Build a new array with some elements filtered out
console.log(ancestry.filter(function(person){
  return person.died-person.born>90;
}));

// Build a new array where each element has been put through a function
console.log(ancestry.map(function(person, index, all){
  return (index+1) + " - " + person.name; 
}));

// Combine all an array’s elements into a single value
console.log(ancestry.reduce(function(min,current,index){
  return current.born < min.born ? current : min;
}));
