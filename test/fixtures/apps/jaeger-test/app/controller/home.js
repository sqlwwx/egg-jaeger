'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    app.redis.set('foo', 'bar');
    const foo = await app.redis.get('foo');
    this.ctx.body = 'hi, ' + this.app.plugins.jaeger.name + '_' + foo;
  }
}

module.exports = HomeController;
