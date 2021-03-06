
var both = require('when-all').args
var async = require('../async')
var Result = require('result')
var chai = require('./chai')
var every = require('..')

function isNumber(n){
	return typeof n == 'number'
}
function notNumber(n){
	return typeof n != 'number'
}

function delay(value){
	var result = new Result
	setTimeout(function(){
		if (value instanceof Error) result.error(value)
		else result.write(value)
	}, Math.random() * 10)
	return result
}

function isTrue(answer){ answer.should.be.true }
function isFalse(answer){ answer.should.be.false }

var array = [1,2,3]
var object = {a:1,b:2,c:3}

describe('every', function () {
	it('should return true on empty input', function () {
		every([], function(){}).should.be.true
		every({}, function(){}).should.be.true
	})

	it('should return true if all items pass', function () {
		every(array, isNumber).should.be.true
		every(object, isNumber).should.be.true
	})

	it('should return false if all items fail', function () {
		every(array, notNumber).should.be.false
		every(object, notNumber).should.be.false
	})

	it('should return false if one item fails', function () {
		every(array, function(v){return v !== 2}).should.be.false
		every(object, function(v){return v !== 2}).should.be.false
	})
})

describe('every/async', function () {
	it('should resolve to true on empty input', function(done){
		both(
			async([], function(){}).then(isTrue),
			async({}, function(){}).then(isTrue)
		).node(done)
	})

	it('should resolve to true if all items pass', function(done){
		function slowTrue(){
			return delay(true)
		}
		both(
			async(array, slowTrue).then(isTrue),
			async(object, slowTrue).then(isTrue)
		).node(done)
	})

	it('should return false if all items fail', function(done){
		function slowFalse(){
			return delay(false)
		}
		both(
			async(array, slowFalse).then(isFalse),
			async(object, slowFalse).then(isFalse)
		).node(done)
	})

	it('should return false if one item fails', function(done){
		both(
			async(array, function(v){return v !== 2}).then(isFalse),
			async(object, function(v){return v !== 2}).then(isFalse)
		).node(done)
	})

	it('should reject if one item errors', function(done){
		function maybeError(value){
			if (v === 2) return delay(new Error('fail'))
			return delay(true)
		}
		
		both(
			async(array, maybeError).then(isTrue),
			async(object, maybeError).then(isTrue)
		).then(null, function(){ done() })
	})

	it('should handle Results as parameters', function(done){
		async(delay([1,2,3]), isNumber).then(isTrue).node(done)
	})
})