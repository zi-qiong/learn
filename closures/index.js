for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(new Date, i, '2');
    }, 10000);
}

console.log(new Date, i, '1');

for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(new Date, i);
    }, 1000);
}

console.log(new Date, i);
