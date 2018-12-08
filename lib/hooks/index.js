'use strict';
const hookSequelize = require('./sequelize');
const hookRedis = require('./redis');

module.exports = app => {
  const { Sequelize, redis, config: { jaeger } } = app;
  if (jaeger.sequelize && Sequelize) {
    app.coreLogger.info('[egg-jaeger] setup Sequelize hooks');
    hookSequelize(app);
  }
  if (jaeger.redis && redis) {
    app.coreLogger.info('[egg-jaeger] setup ioredis hooks');
    hookRedis(app);
  }
};
