'use strict';

/**
 * egg-jaeger default config
 * @member Config#jaeger
 * @property {Boolean} sequelize - tracer sequelize ?
 * @property {Boolean} redis - tracer redis ?
 */
exports.jaeger = {
  serviceName: 'your-service-name',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    // collectorEndpoint: 'http://jaeger-collector:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
  },
  hooks: {
    sequelize: false,
    mysql2: false,
    redis: false,
  },
  middlewareIndex: 1,
};
