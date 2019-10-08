'use strict';

const hooks = require('./lib/hooks');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  configWillLoad() {
    const { middlewareIndex } = this.app.config.jaeger;
    this.app.config.middleware.splice(middlewareIndex, 0, 'jaeger');
  }
  async didReady() {
    this.app.als.enable();
    hooks(this.app);
  }
}

module.exports = AppBootHook;
