'use strict';

const hooks = require('./lib/hooks');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  configDidLoad() {
    const { middlewareIndex } = this.app.config.jaeger;
    this.app.config.coreMiddleware.splice(middlewareIndex, 0, 'jaeger');
  }
  async didReady() {
    this.app.als.enable({ ignoreNoneParent: true });
    hooks(this.app);
  }
}

module.exports = AppBootHook;
