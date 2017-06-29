"use strict";

module.exports = function (_ref) {
  var t = _ref.types;

  return {
    name: "transform-property-literals",
    visitor: {
      // { 'foo': 'bar' } -> { foo: 'bar' }
      ObjectProperty: {
        exit(_ref2) {
          var node = _ref2.node;

          var key = node.key;
          if (!t.isStringLiteral(key)) {
            return;
          }

          if (key.value.match(/^\d+$/)) {
            var newProp = parseInt(node.key.value, 10);
            if (newProp.toString() === node.key.value) {
              node.key = t.numericLiteral(newProp);
              node.computed = false;
            }
          } else if (t.isValidIdentifier(key.value)) {
            node.key = t.identifier(key.value);
            node.computed = false;
          }
        }
      }
    }
  };
};