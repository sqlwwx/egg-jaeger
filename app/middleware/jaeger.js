'use strict';

const finishSpan = (span, ctx, err) => {
  span.setTag('http.status_code', ctx.response.status);
  if (err) {
    span.setTag('error', true);
    span.log({
      event: 'error',
      'error.object': err,
      message: err.message,
      stack: err.stack,
    });
  }
  ctx.app.coreLogger.debug('[egg-jaeger] finishSpan', span);
  span.finish();
};

module.exports = (options, app) => async function jaegerMiddleware(ctx, next) {
  app.als.scope();
  const span = app.startSpan(ctx.path, {
    'http.method': ctx.method,
    'http.url': ctx.url,
  });
  try {
    await next();
    finishSpan(span, ctx);
  } catch (err) {
    finishSpan(span, ctx, err);
    throw err;
  }
};
