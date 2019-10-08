'use strict';

const supportedHooks = {
  sequelize: require('./sequelize'),
  redis: require('./redis'),
  mysql2: require('./mysql2'),
};

module.exports = app => {
  const { jaeger: { hooks } } = app.config;
  Object.entries(hooks).forEach(([ key, enable ]) => {
    if (!enable) {
      return
    }
    if (supportedHooks[key]) {
      supportedHooks[key](app);
    } else {
      console.warn(`NOT SUPPORTED HOOK [${key}]`)
    }
  });
};
