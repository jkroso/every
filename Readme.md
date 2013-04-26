
# every

  assert that every item in an object passes an assertion. This module treats Arrays and Objects the same, it just wants a set of key value pairs to iterate over. Async/Sync variations are available.

## Getting Started

_With component_  

	$ component install jkroso/every

_With npm_  

	$ npm install --save https://github.com/jkroso/every/archive/master.tar.gz


then in your app:

```js
var every = require('every')
var async = require('every/async')
var series = require('every/series')
```

## API

- [every()](#every)
- [async()](#async)
- [series()](#series)

### every(obj:Object|Array, pred:Function, [ctx]:Any)

  assert `pred` on every key value pair of `obj`

```js
every({a:1, b:2}, function(value, key){
  return typeof value == 'number'
}) // => true
```

### async(obj:Object|Array, pred:Function, [ctx]:Any)

  same API as every except it returns its result via a promise. If `pred` needs to do its work asynchronously it should either return a promise or take a callback to pass its result to. `async` does not wait between iterations so in most cases concurrency will be equal to the length of the input.

```js
every([30, 20, 10], function(value, key, done){
  setTimeout(function(){ done(null, true) }, value)
}).then(function(answer){
  // In this case `answer` will be `true`
})
```

### series(obj:Object|Array, pred:Function, [ctx]:Any)

not yet implemented

## Running the tests

```bash
$ npm install
$ make
```
Then open your browser to the `./test` directory.

_Note: these commands don't work on windows._ 

## License 

[MIT](License)