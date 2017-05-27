// HW #4

function every(array, testFunc){
    console.log(array);
    for (i in array) {
        if (!testFunc(array[i])) return false;
    }
    return true;
}

function some(array, testFunc){
    console.log(array);
     for (i in array) {
        if (testFunc(array[i])) return true;
    }
    return false;
}

console.log(every([NaN, 3, 4], isNaN));
// → true
console.log(every([2, 3, 4], isNaN));
// → false
console.log(every([NaN,  NaN], isNaN));
// → false

console.log(some([NaN, 3, 4], isNaN));
// → true
console.log(some([2, 3, 4], isNaN));
// → false
console.log(some([NaN,  NaN], isNaN));
// → false