
var should = require('chai').should()
  , every = require('..')
  , async = require('../async')
  , both = require('when-all/naked')
  , promise = require('laissez-faire')

function yes(){return true}
function no(){return false}
var slowYes = delayed(true)
var slowNo = delayed(false)
function delayed(value, method){
	method || (method = 'fulfill')
	return function(){
		var p = promise()
		delay(function () { p[method](value) })
		return p
	}
}
function delay(fn){
	var args = [].slice.call(arguments, 1)
	setTimeout(function(){ fn.apply(null, args) }, Math.random() * 10)
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
		every(array, yes).should.be.true
		every(object, yes).should.be.true
	})

	it('should return false if all items fail', function () {
		every(array, no).should.be.false
		every(object, no).should.be.false
	})

	it('should return false if one item fails', function () {
		every(array, function(v){return v !== 2}).should.be.false
		every(object, function(v){return v !== 2}).should.be.false
	})
})

describe('every/async', function () {
	it('should resolve to true on empty input', function (done) {
		both(
			async([], function(){}).then(isTrue),
			async({}, function(){}).then(isTrue)
		).node(done)
	})

	it('should resolve to true if all items pass', function (done) {
		both(
			async(array, slowYes).then(isTrue),
			async(object, slowYes).then(isTrue)
		).node(done)
	})

	it('should return false if all items fail', function (done) {
		both(
			async(array, slowNo).then(isFalse),
			async(object, slowNo).then(isFalse)
		).node(done)
	})

	it('should return false if one item fails', function (done) {
		both(
			async(array, function(v){return v !== 2}).then(isFalse),
			async(object, function(v){return v !== 2}).then(isFalse)
		).node(done)
	})

	it('should reject if one item errors', function (done) {
		function maybeError(v){
			return promise(function(fulfill, reject){
				delay(function(){
					if (v === 2) reject(new Error('fail'))
					else fulfill(true)
				})
			})
		}
		
		both(
			async(array, maybeError).then(isTrue),
			async(object, maybeError).then(isTrue)
		).otherwise(function(){ done() })
	})

	describe('CPS', function () {
		function cpsTrue(value, i, next){
			delay(next, null, true)
		}
		function cpsFalse(value, i, next){
			delay(next, null, false)
		}
		function cpsMaybeError(value, i, next){
			if (value === 2) delay(next, new Error('cps fail '+value))
			else delay(next, null, true)
		}
		
		it('passing scenario', function (done) {
			both(
				async(array, cpsTrue).then(isTrue),
				async(object, cpsTrue).then(isTrue)
			).node(done)
		})

		it('failing scenario', function (done) {
			both(
				async(array, cpsFalse).then(isFalse),
				async(object, cpsFalse).then(isFalse)
			).node(done)
		})

		it('erroring scenario', function (done) {
			both(
				async(array, cpsMaybeError).then(isTrue),
				async(object, cpsMaybeError).then(isTrue)
			).otherwise(function(){ done() })
		})
	})
})
