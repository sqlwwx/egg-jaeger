'use strict';

/**
 * egg-jaeger default config
 * @member Config#jaeger
 * @property {Boolean} sequelize - tracer sequelize ?
 * @property {Boolean} redis - tracer redis ?
 */
exports.jaeger = {
  sequelize: true,
  redis: true,
};
