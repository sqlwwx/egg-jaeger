'use strict';

const hooks = require('./lib/hooks');

module.exports = app => {
  app.beforeStart(async () => {
    app.als.enable();
    hooks(app);
  });
  // put before other core middlewares
  app.config.coreMiddlewares.unshift('jaeger');
};
