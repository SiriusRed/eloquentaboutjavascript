var ANCESTRY_FILE  = require("./05_data.js");

var ancestry = JSON.parse(ANCESTRY_FILE);

// HOMEWORK #2

// function average(array) {
//   function plus(a, b) { return a + b; }
//   return array.reduce(plus) / array.length;
// }

// function getYoungestChild(mother, array) {
//   var childs = array.filter(function(person){
//     return person.mother==mother.name;
//   });
//   return childs.reduce(function(previous,current){
//     return current.born < previous.born ? current : previous;
//   });
// }

// var byName = {};

// ancestry.forEach(function(person) {
//   byName[person.name] = person;
// });

// var hasKnownMother = ancestry.filter(function(person){
//   return typeof byName[person.mother] !== "undefined";
// });

// console.log(average(hasKnownMother.map(function(person){
//   return getYoungestChild(byName[person.mother],hasKnownMother).born - byName[person.mother].born;
// })));
s

