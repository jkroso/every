
var each = require('foreach/async').plain
var ResultType = require('result-type')

/**
 * assert `pred` on every key value pair of `obj`
 *
 * @param {Object|Array} obj
 * @param {Function} pred (value, key) -> Promise Boolean
 * @param {Any} [ctx]
 * @return {Result} Boolean
 */

module.exports = function(obj, pred, ctx){
	if (obj == null) return true
	var res = true
	return each(obj, function(value, key){
		if (!res) return
		var ok = pred.call(this, value, key)
		if (ok instanceof ResultType) return ok.then(assert)
		else if (!ok) res = false
	}, ctx).then(function(){
		return res
	})
	function assert(value){
		if (!value) res = false
	}
}