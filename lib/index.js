'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' ),
	isnan = require( 'validate.io-nan' ),
	isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isMatrixLike = require( 'validate.io-matrix-like' ),
	ctors = require( 'compute-array-constructors' ),
	matrix = require( 'dstructs-matrix' ),
	validate = require( './validate.js' );


// FUNCTIONS //

var ekurtosis1 = require( './number.js' ),
	ekurtosis2 = require( './array.js' ),
	ekurtosis3 = require( './accessor.js' ),
	ekurtosis4 = require( './deepset.js' ),
	ekurtosis5 = require( './matrix.js' ),
	ekurtosis6 = require( './typedarray.js' );


// EKURTOSIS //

/**
* FUNCTION: ekurtosis( v[, opts] )
*	Computes the distribution ekurtosis.
*
* @param {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} v - input value
* @param {Object} [opts] - function options
* @param {Boolean} [opts.copy=true] - boolean indicating if the function should return a new data structure
* @param {Function} [opts.accessor] - accessor function for accessing array values
* @param {String} [opts.path] - deep get/set key path
* @param {String} [opts.sep="."] - deep get/set key path separator
* @param {String} [opts.dtype="float64"] - output data type
* @returns {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} distribution ekurtosis(s)
*/
function ekurtosis( v, options ) {
	/* jshint newcap:false */
	var opts = {},
		ctor,
		err,
		out,
		dt,
		d;

	if ( isNumber( v ) || isnan( v ) ) {
		return ekurtosis1( v );
	}
	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	if ( isMatrixLike( v ) ) {
		if ( opts.copy !== false ) {
			dt = opts.dtype || 'float64';
			ctor = ctors( dt );
			if ( ctor === null ) {
				throw new Error( 'ekurtosis()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
			}
			// Create an output matrix:
			d = new ctor( v.length );
			out = matrix( d, v.shape, dt );
		} else {
			out = v;
		}
		return ekurtosis5( out, v );
	}
	if ( isTypedArrayLike( v ) ) {
		if ( opts.copy === false ) {
			out = v;
		} else {
			dt = opts.dtype || 'float64';
			ctor = ctors( dt );
			if ( ctor === null ) {
				throw new Error( 'ekurtosis()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
			}
			out = new ctor( v.length );
		}
		return ekurtosis6( out, v );
	}
	if ( isArrayLike( v ) ) {
		// Handle deepset first...
		if ( opts.path ) {
			opts.sep = opts.sep || '.';
			return ekurtosis4( v, opts.path, opts.sep );
		}
		// Handle regular and accessor arrays next...
		if ( opts.copy === false ) {
			out = v;
		}
		else if ( opts.dtype ) {
			ctor = ctors( opts.dtype );
			if ( ctor === null ) {
				throw new TypeError( 'ekurtosis()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + opts.dtype + '`.' );
			}
			out = new ctor( v.length );
		}
		else {
			out = new Array( v.length );
		}
		if ( opts.accessor ) {
			return ekurtosis3( out, v, opts.accessor );
		}
		return ekurtosis2( out, v );
	}
	return NaN;
} // end FUNCTION ekurtosis()


// EXPORTS //

module.exports = ekurtosis;
