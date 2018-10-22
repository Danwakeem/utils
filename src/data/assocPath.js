import isArray from '../base/isArray'
import isInteger from '../base/isInteger'
import isNil from '../base/isNil'
import curry from '../common/curry'
import assocIndex from './assocIndex'
import assocProp from './assocProp'
import has from './has'

/**
 * Makes a shallow clone of an object, setting or overriding the nodes required
 * to create the given path, and placing the specific value at the tail end of
 * that path. Note that this copies and flattens prototype properties onto the
 * new object as well. All non-primitive properties are copied by reference.
 *
 * @function
 * @since v0.0.3
 * @category data
 * @typedefn Idx = String | Int
 * @sig [Idx] -> a -> {a} -> {a}
 * @param {Array} path the path to set
 * @param {*} value The new value
 * @param {Object|Array|Map} collection The object, array or map to clone
 * @returns {*} A new collection equivalent to the original except along the specified path.
 * @example
 *
 * assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
 *
 * // Any missing or non-object keys in path will be overridden
 * assocPath(['a', 0, 'c'], 42, {a: 5}); //=> {a: [{c: 42}]}
 */
const assocPath = curry((path, value, collection) => {
  if (path.length === 0) {
    return value
  }
  const [part] = path
  if (path.length > 1) {
    const nextCollection =
      !isNil(collection) && has(part, collection) ? collection[part] : isInteger(path[1]) ? [] : {}
    value = assocPath(Array.prototype.slice.call(path, 1), value, nextCollection)
  }
  if (isInteger(part) && isArray(collection)) {
    return assocIndex(part, value, collection)
  }
  return assocProp(part, value, collection)
})

export default assocPath
