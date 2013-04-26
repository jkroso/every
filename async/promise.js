
var Promise = require('laissez-faire/full')
  , when = require('when/read')

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
			when(pred.call(ctx, obj[k], k), done, fail)
		}
	}
	// object
	else {
		var keys = []
		for (var k in obj) keys.push(k)
		if (!(len = keys.length)) return p.fulfill(true)
		var pending = len
		for (var i = 0; i < len; i++) {
			when(pred.call(ctx, obj[k = keys[i]], k), done, fail)
		}
	}

	function done(answer){
		if (!answer) p.fulfill(false), len = 0
		else if (--pending <= 0) p.fulfill(true)
	}
	function fail(e){ p.reject(e) }

	return p
}
