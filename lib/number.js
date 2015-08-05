'use strict';

// MODULES //

var isPositive = require( 'validate.io-positive-primitive' );


// EKURTOSIS //

/**
* FUNCTION ekurtosis( v )
*	Computes the distribution ekurtosis for a Student t distribution with parameter v.
*
* @param {Number} v - degrees of freedom
* @returns {Number} distribution ekurtosis
*/
function ekurtosis( v ) {
	if ( !isPositive( v ) || v < 2 ) {
		return NaN;
	}
	if ( v <= 4 ) {
		return Number.POSITIVE_INFINITY;
	}
	// Case: v > 4
	return 6 / ( v - 4 );
} // end FUNCTION ekurtosis()


// EXPORTS

module.exports =  ekurtosis;
