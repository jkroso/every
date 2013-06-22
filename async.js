
var each = require('foreach/async').plain
  , ResultType = require('result-type')
  , decorate = require('when/decorate')

module.exports = decorate(parallelEvery)
module.exports.plain = parallelEvery

/**
 * assert `pred` on every key value pair of `obj`
 *
 * @param {Object|Array} obj
 * @param {Function} pred (value, key)
 * @param {Any} [ctx]
 * @return {Result} Boolean
 */

function parallelEvery(obj, pred, ctx){
	if (obj == null) return true
	var res = true
	return each(obj, function(value, key){
		if (!res) return
		var ok = pred.call(this, value, key)
		if (ok instanceof ResultType) return ok.then(assert)
		else assert(ok)
	}, ctx).then(function(){
		return res
	})
	function assert(value){
		if (!value) res = false
	}
}