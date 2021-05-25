'use strict';

const { AsyncLocalStorage } = require('async_hooks');

if (!global.als) {
  Object.defineProperties(global, {
    als: {
      value: new AsyncLocalStorage(),
    },
  });
} else {
  if (!(global.als instanceof AsyncLocalStorage)) {
    throw new Error('global.als should be an instance of AsyncLocalStorage');
  }
}
