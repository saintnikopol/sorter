
/**
 * HYP : i < j
 */

function hoarePartion ( compare , a , i , j ) {

    const o = i ;
    const x = a[o] ;

    while ( true ) {

        while ( true ) {

            --j ;

            if ( i >= j ) {
                a[o] = a[j] ;
                a[j] = x ;
                return j ;
            }

            else if ( compare( x , a[j] ) > 0 ) {
                break ;
            }
        }

        while ( true ) {

            ++i ;

            if ( i >= j ) {
                a[o] = a[j] ;
                a[j] = x ;
                return j ;
            }

            else if ( compare( x , a[i] ) < 0 ) {
                break ;
            }
        }


        // invariant i < j

        const t    = a[i] ;
        a[i] = a[j] ;
        a[j] =    t ;

    }

}


/**
 * Template for the recursive implementation of quicksort.
 * This template allows to generate a specific version of the quicksort
 * algorithm for a certain partitioning algorithm.
 *
 * @param {callable} partition the implementation for the partitioning step
 */

function singleQuickSort ( partition ) {

    /**
     * Sorts interval [left,right) of the array parameter according to a
     * compare method.
     *
     * @param {comparator} compare the comparator function
     * @param {array} array random access array
     * @param {offset} left inner left bound of the interval to sort
     * @param {offset} right outer right bound of the interval to sort
     *
     */

    const sort = function ( compare , array , left , right ) {

        // in the case where interval [left,right) contains
        // only one element we are done!

        if ( right - left < 2 ) return ;

        // otherwise we partition interval [left,right) into three disjoint
        // subintervals [left,pivot), [pivot, pivot+1) and [pivot+1,right)
        // where the pivot is the position whose element
        // is greater or equal to all elements of the first subinterval
        // and less or equal to all elements of the third subinterval

        const pivot = partition( compare , array , left , right ) ;

        // and then we just need to ask the recursion fairy
        // to sort the first and third subintervals

        // the recursion fairy sorts [left,pivot)
        sort( compare , array , left      , pivot ) ;

        // and then [pivot+1,right)
        sort( compare , array , pivot + 1 , right ) ;

    } ;

    return sort;

}


function compareNumber (valueA, valueB) {
     if (valueA === valueB) {
         return 0;
     } else if (valueA < valueB) {
         return -1
     } else {
         return 1;
     }
}


function compareString (stringA = '', string_B = '') {

    return stringA.localeCompare(string_B);

    /* Expected Returns:

     0:  exact match

    -1:  stringA < stringB

     1:  stringB > stringB

     */
}

/**
 * Compare Object
 *
 * @param objectA
 * @param objectB
 */
//@NOTE: NEVER USE IN PRODUCTION !!!
// FOR DOCUMENTATION PURPOSES ONLY
function compareObject (objectA = {}, objectB = {}) {
    throw "Do not use this method inside sort function!";
    let strA = JSON.stringify(objectA);
    let strB = JSON.stringify(objectB);
    return compareString(strA, strB);
}

const sortFunction = singleQuickSort(hoarePartion);


module.exports = {
    sortFunction,
    compareNumber,
    compareString,
    compareObject,
};