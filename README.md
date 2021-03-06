# nanorouter [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Smol frontend router

## Usage
```js
var nanorouter = require('nanorouter')
var router = nanorouter({ default: '/404' })

router.on('/foo', function (params) {
  console.log('hit /foo')
})
router.on('/foo/:bar', function (params) {
  console.log('hit a route with params', params.bar)
})
router.on('/foo#baz', function (params) {
  console.log('we do hash routes too!')
})
router.on('/foo/*', function (params) {
  console.log('and even wildcards', params.wildcard)
})

router.emit('/foo/hello-planet')
```

## FAQ
### How is this different from sheet-router?
`sheet-router` does slightly more and has a different syntax. This router is
lighter, faster and covers less concerns. They're pretty similar under the hood
though.

## API
### `router = nanorouter([opts])`
Create a new router. `opts` can be:
- __opts.default:__ set a default handler in case no route matches. Defaults to
  `/404`

### `router.on(routename, handler(params))`
Register a handler on a routename. The handler receives an object with params
on each render. A result can be `return`ed the caller function.

### `result = router.emit(routename)`
Call a handler for a `routename`. If no handler matches, the handler specified
in `opts.default` will be called. If no default handler matches, an error will
be thrown. Results returned from the called handler will be returned from this
function.

### `matchedRoute = router.match(route)`
Matches a route and returns an object. The returned object contains the properties `{cb, params, route}`. This method does not invoke the callback of a route. If no route matches, the route specified in `opts.default` will be returned. If no default route matches, an error will be thrown.

Note that `router()` does not affect browser history. If you would like to
add or modify history entries when you change routes, you should use
[`history.pushState()` and `history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries)
alongside `router()`.

## See Also
- [yoshuawuyts/sheet-router](https://github.com/yoshuawuyts/sheet-router)
- [yoshuawuyts/wayfarer](https://github.com/yoshuawuyts/wayfarer)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanorouter.svg?style=flat-square
[3]: https://npmjs.org/package/nanorouter
[4]: https://img.shields.io/travis/choojs/nanorouter/master.svg?style=flat-square
[5]: https://travis-ci.org/choojs/nanorouter
[6]: https://img.shields.io/codecov/c/github/choojs/nanorouter/master.svg?style=flat-square
[7]: https://codecov.io/github/choojs/nanorouter
[8]: http://img.shields.io/npm/dm/nanorouter.svg?style=flat-square
[9]: https://npmjs.org/package/nanorouter
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
