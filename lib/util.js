'use strict';

function wrap(object, method, patch) {
  const original = object[method];
  object[method] = patch(original);
}

module.exports = {
  wrap,
};
