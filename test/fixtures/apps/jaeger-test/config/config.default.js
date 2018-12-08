'use strict';

exports.keys = '123456';

exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: '0',
  },
};

exports.logger = {
  coreLogger: {
    level: 'DEBUG',
  },
};

exports.jaeger = {
  serviceName: 'jaeger-test',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    collectorEndpoint: 'http://tracing-analysis-dc-hz.aliyuncs.com/api/traces',
    username: process.env.TRACE_USERNAME || 'test',
    password: process.env.TRACE_PASS || 'test',
  },
};
