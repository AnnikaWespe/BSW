/**
 * Method takes a source object and returns a "json representation" which is
 * used to send via HTTP or store in client side storage like
 * localstorage or indexed db
 *
 * It is possible to exclude properties via the `exclude` parameter
 */
export declare function toJSON(source: any, excludes?: Array<string>, includes?: Array<string>, compact?: boolean): {};
