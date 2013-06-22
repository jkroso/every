
# every

  check that every value in an object passes a predicate. This module treats Arrays and Objects the same, it just wants a set of key value pairs to iterate over. Async/Sync variations are available.

## Installation

_With [component](//github.com/component/component), [packin](//github.com/jkroso/packin) or [npm](//github.com/isaacs/npm)_  

    $ {package mananger} install jkroso/every

then in your app:

```js
var every = require('every')
var async = require('every/async')
```

## API

- [every()](#every)
- [async()](#async)

### every(obj:Object|Array, pred:Function, [ctx]:Any)

  assert `pred` on every key value pair of `obj`

```js
every({a:1, b:2}, function(value, key){
  return typeof value == 'number'
}) // => true
```

### async(obj:Object|Array, pred:Function, [ctx]:Any)

  same API as every except it fully understands the semantics of [Results](//github.com/jkroso/result). That means you can pass them as arguments or return them from `pred` and it will do the right thing.

```js
every([30, 20, 10], function(value, key){
	var result = new Result
  setTimeout(function(){
  	result.write(value > 15)
  }, value)
  return result
}).read(function(answer){
  // In this case `answer` will be `false`
})
```

## Running the tests

```bash
$ make
```

Then open your browser to the `./test` directory.