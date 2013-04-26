
/**
 * assert `pred` on every key value pair of `obj`
 *
 * @param {Object|Array} obj
 * @param {Function} pred (value, key) -> Boolean
 * @param {Any} [ctx]
 * @return {Boolean}
 */

module.exports = function(obj, pred, ctx){
	if (obj == null) return true
	var len = obj.length
	// array
	if (len === +len) {
		var k = 0
		while (k < len) {
			if (!pred.call(ctx, obj[k], k++)) return false
		}
	}
	// object
	else {
		for (var k in obj) {
			if (!pred.call(ctx, obj[k], k)) return false
		}
	}
	return true
}