'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    await app.redis.get('test').set('foo', 'bar');
    const foo = await app.redis.get('test').get('foo');
    this.ctx.body = 'hi, ' + this.app.plugins.jaeger.name + '_' + foo;
  }
}

module.exports = HomeController;
