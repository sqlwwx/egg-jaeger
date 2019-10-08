'use strict';

const util = require('../util');
module.exports = app => {
  try {
    const Connection = require('mysql2/lib/connection');
    util.wrap(Connection.prototype, 'query', original => {
      return function query(sql, values, cb) {
        const span = app.startSpan('mysql.query', {
          'db.statement': sql,
          'db.type': 'mysql',
          component: 'mysql2',
          'span.kind': 'client',
          'db.instance': this.config.database || 'sql',
        });
        const sequence = original.call(this, sql, values, (err, ret) => {
          if (err) {
            span.addTags({
              'error.type': err.name,
              'error.msg': err.message,
              'error.stack': err.stack,
            });
          }
          span.finish();
          cb(err, ret);
        });
        sequence.on('end', () => {
          span.finish();
        });
        return sequence;
      };
    });
  } catch (err) {
    console.warn(err);
  }
};
