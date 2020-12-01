function curry(fn) {
    var args = [].slice.call(arguments, 1)

    return function() {
        var newArgs = args.concat([].slice.call(arguments))
        return fn.apply(this, newArgs)
    }
}

function add(a, b) {
    return a + b;
}

var addCurry = curry(add, 1, 2);
console.log(addCurry()) // 3
//或者
var addCurry = curry(add, 1);
console.log(addCurry(2)) // 3
//或者
var addCurry = curry(add);
console.log(addCurry(1, 2)) // 3