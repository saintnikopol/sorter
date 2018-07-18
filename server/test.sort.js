const quicksort = require('./quicksort');

let {sortFunction, compareString, compareNumber} = quicksort;

let a = [ 1 , 6 , 5 , 3 , 2 , 4 ] ;
console.log(" XX let a = [ 1 , 6 , 5 , 3 , 2 , 4 ] ; let  === ", a);

let result = sortFunction( compareNumber , a , 0 , a.length ) ;
console.log(" XX let result = sort( compareNumber() , a , 0 , a.length ) ; result  === ", result );


console.log(" XX let a = [ 1 , 6 , 5 , 3 , 2 , 4 ] ; let  === ", a);
