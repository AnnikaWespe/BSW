/**
 * Simple $parse() helper
 */
export const parse = function (path) {
  let pathItems = path.split('.');

  return function (object) {
    let attribute = object;

    pathItems.forEach(function (pathItem) {
      attribute = !!attribute ? attribute[pathItem] : null;
    });

    return attribute;
  };
};
