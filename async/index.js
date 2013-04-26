
var promising = require('./promise')
  , cb = require('./cb')

/**
 * dispatch to callback or promise based API depending
 * on if the predicate could support CPS
 *
 * @param {Object|Array} obj
 * @param {Function} pred (value, key[, done])
 * @param {Any} [ctx]
 * @return {Promise} Boolean
 */

module.exports = function(obj, pred, ctx){
	return pred.length < 3
		? promising(obj, pred, ctx)  
		: cb(obj, pred, ctx)
}