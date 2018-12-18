'use strict';

const cluster = require('cluster');
const address = require('address');
const cacheJaeger = Symbol('jaeger_client_tracer');
const { initTracer, opentracing } = require('jaeger-client');
const als = require('async-local-storage');

const WORKER_ID = cluster.worker ? cluster.worker.id : 0;
const IPV4 = address.ip();
const IPV6 = address.ipv6();

module.exports = {
  get als() {
    return als;
  },
  get jaeger() {
    if (!this[cacheJaeger]) {
      this[cacheJaeger] = initTracer(this.config.jaeger);
    }
    return this[cacheJaeger];
  },
  get opentracing() {
    return opentracing;
  },
  startSpan(name, tags = {}) {
    this.coreLogger.debug('[egg-jaeger] startSpan %s', name);
    tags['app.version'] = this.loader.pkg.version;
    tags['worker.id'] = WORKER_ID;
    tags['process.id'] = process.pid;
    tags['local.ipv4'] = IPV4;
    tags['local.ipv6'] = IPV6;
    const childOf = this.als.getFromParent('span');
    const span = this.jaeger.startSpan(name, childOf ? { childOf, tags } : { tags });
    this.als.set('span', span);
    return span;
  },
};
