'use strict';

const cluster = require('cluster');
const address = require('address');
const cacheJaeger = Symbol('jaeger_client_tracer');
const { initTracer, opentracing } = require('jaeger-client');

const WORKER_ID = cluster.worker ? cluster.worker.id : 0;
const IPV4 = address.ip();
const IPV6 = address.ipv6();
const PROCESS_PID = process.pid;

module.exports = {
  get jaeger() {
    if (!this[cacheJaeger]) {
      this[cacheJaeger] = initTracer(this.config.jaeger);
    }
    return this[cacheJaeger];
  },
  get opentracing() {
    return opentracing;
  },
  initSpan(name, tags) {
    global.als.enterWith(new Map([[ 'layerCount', 1 ]]));
    return this.startSpan(name, tags);
  },
  startSpan(name, tags = {}) {
    this.coreLogger.debug('[egg-jaeger] startSpan %s', name);
    const parentState = global.als.getStore();
    if (!parentState || !(parentState instanceof Map)) {
      return null;
    }
    let layerCount = parentState.get('layerCount');
    if (!layerCount) {
      return null;
    }
    Object.assign(tags, {
      'app.version': this.loader.pkg.version,
      'worker.id': WORKER_ID,
      'process.id': PROCESS_PID,
      'local.ipv4': IPV4,
      'local.ipv6': IPV6,
    });
    const childOf = parentState.get('span');
    layerCount = childOf ? layerCount + 1 : layerCount;
    const span = this.jaeger.startSpan(name, childOf ? { childOf, tags } : { tags });
    global.als.enterWith(
      new Map(parentState)
        .set('span', span)
        .set('layerCount', layerCount)
    );
    if (layerCount > 100) { console.warn(`jaeger layerCount ${layerCount}`); }
    if (layerCount > 300) { console.error(`jaeger layerCount ${layerCount}`); }
    return span;
  },
};
