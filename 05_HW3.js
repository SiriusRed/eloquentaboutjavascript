var ANCESTRY_FILE  = require("./05_data.js");

var ancestry = JSON.parse(ANCESTRY_FILE);

// HOMEWORK #3


function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

function getCentry(person) {
    return Math.ceil(person.died/100);
}


function groupByAges(array) {
    var byKey = {};
        array.forEach(function(element) {
             byKey[getCentry(element)] = array.filter(function(person){
                return getCentry(element) == getCentry(person);
             });
        });
    return byKey;
}

function groupBy(array, categoryFunc) {
    var byKey = {};
    array.forEach(function(element){
        var category = categoryFunc(element);
        if (category in byKey) {
            byKey[category].push(element);
        } else {
            byKey[category] = [element];
        }
    });
    return byKey;
}

function getMother(person) {
    return person.mother;
}

console.log(groupBy(ancestry,getMother));

// for (key in groupByAges(ancestry)) {
//     console.log(key + ": " + average(groupByAges(ancestry)[key].map(function(person){return person.died-person.born})));
// }


