'use strict';

const util = require('../util');

module.exports = app => {
  util.wrap(app.redis, 'sendCommand', original => {
    return function(command) {
      const span = app.startSpan('redis ' + command.name, {
        'db.instance': this.options.db,
        'db.statement': command.name + ' ' + command.args.join(' '),
        'db.type': 'redis',
        'span.kind': 'client',
      });
      return original.apply(this, arguments).then(
        value => {
          span.finish();
          return value;
        },
        err => {
          span.finish(err);
          throw err;
        }
      );
    };
  });
};
