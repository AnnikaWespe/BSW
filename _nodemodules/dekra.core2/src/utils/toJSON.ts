/**
 * Method takes a source object and returns a "json representation" which is
 * used to send via HTTP or store in client side storage like
 * localstorage or indexed db
 *
 * It is possible to exclude properties via the `exclude` parameter
 */
export function toJSON(
  source: any,
  excludes: Array<string> = [],
  includes: Array<string> = [],
  compact = true
  ) {

  let target = {};

  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      let value = source[key];
      if (includes.length > 0 && includes.indexOf(key)  === -1) {
        continue;
      }
      if (excludes.length > 0 && excludes.indexOf(key) > -1) {
        continue;
      }
      if (key === '$$hashKey') {
        continue;
      }
      if (compact && !value) {
        continue;
      }

      target[key] = (!!value && typeof value.toJSON === 'function') ? value.toJSON() : value;
    }
  }

  return target;
}
