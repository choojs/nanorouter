var trie = require('wayfarer/trie')
var assert = require('assert')

var isLocalFile = (/file:\/\//.test(typeof window === 'object' &&
  window.location && window.location.origin)) // electron support

/* eslint-disable no-useless-escape */
var electron = '^(file:\/\/|\/)(.*\.html?\/?)?'
var protocol = '^(http(s)?(:\/\/))?(www\.)?'
var domain = '[a-zA-Z0-9-_\.]+(:[0-9]{1,5})?(\/{1})?'
var qs = '[\?].*$'
/* eslint-enable no-useless-escape */

var stripElectron = new RegExp(electron)
var prefix = new RegExp(protocol + domain)
var normalize = new RegExp('#')
var suffix = new RegExp(qs)

module.exports = Nanorouter

function Nanorouter (opts) {
  opts = opts || {}

  var _trie = trie()
  var _default = (opts.default || '').replace(/^\//, '') || '/404'
  var curry = opts.curry || false
  var prevRoute = null
  var prevMatch = null

  emit._trie = _trie
  emit.on = on
  emit.match = match
  return emit

  function on (route, cb) {
    assert.equal(typeof route, 'string')
    assert.equal(typeof cb, 'function')
    route = route.replace(/^[#/]/, '') || '/'
    cb.route = route

    if (cb && cb._trie) {
      _trie.mount(route, cb._trie.trie)
    } else {
      var node = _trie.create(route)
      node.cb = cb
    }
  }

  function emit (route) {
    var matched
    var args = new Array(arguments.length)
    for (var i = 1; i < args.length; i++) {
      args[i] = arguments[i]
    }

    if (!curry) {
      matched = match(route)
      args[0] = matched.params
      return matched.handler.apply(matched.handler, args)
    }

    route = pathname(route, isLocalFile)
    if (route === prevRoute) {
      matched = prevMatch
    } else {
      matched = match(route)
      prevRoute = route
      prevMatch = matched
    }

    args[0] = matched.params
    return matched.handler.apply(matched.handler, args)()
  }

  function match (route) {
    assert.notEqual(route, undefined, "'route' must be defined")
    if (route === prevRoute) return prevMatch

    var matched = _trie.match(route)
    if (matched && matched.cb) return toMatchObj(matched)

    var dft = _trie.match(_default)
    if (dft && dft.cb) return toMatchObj(dft)

    throw new Error("route '" + route + "' did not match")
  }
}

// replace everything in a route but the pathname and hash
function pathname (route, isElectron) {
  if (isElectron) route = route.replace(stripElectron, '')
  else route = route.replace(prefix, '')
  return route.replace(suffix, '').replace(normalize, '/')
}

function toMatchObj (match) {
  return {handler: match.cb, params: match.params, route: match.cb.route}
}
