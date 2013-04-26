
var Promise = require('laissez-faire/full')

/**
 * assert `pred` on every key value pair of `obj`
 *
 * @param {Object|Array} obj
 * @param {Function} pred (value, key) -> Promise Boolean
 * @param {Any} [ctx]
 * @return {Promise} Boolean
 */

module.exports = function(obj, pred, ctx){
	if (obj == null) return true
	var p = new Promise
	var len = obj.length
	// array
	if (len === +len) {
		if (!len) return p.fulfill(true)
		var k = 0
		var pending = len
		for (var k = 0; k < len; k++) {
			pred.call(ctx, obj[k], k, done)
		}
	}
	// object
	else {
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(len = keys.length)) return p.fulfill(true)
		var pending = len
		for (var i = 0; i < len; i++) {
			pred.call(ctx, obj[k = keys[i]], k, done)
		}
	}

	function done(e, answer){
		if (e) return p.reject(e)
		if (!answer) p.fulfill(false), len = 0
		else if (--pending <= 0) p.fulfill(true)
	}

	return p
}
