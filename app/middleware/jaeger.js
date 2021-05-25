'use strict';

const { Tags } = require('opentracing');

const finishSpan = (span, ctx, err) => {
  span.setTag('http.status_code', ctx.response.status);
  if (err) {
    span.setTag('error', true);
    span.log({
      event: Tags.ERROR,
      'error.object': err,
      message: err.message,
      stack: err.stack,
    });
  }
  ctx.app.coreLogger.debug('[egg-jaeger] finishSpan', span);
  span.finish();
};

module.exports = (options, app) => async function jaegerMiddleware(ctx, next) {
  const span = app.initSpan(ctx.url, {
    [Tags.HTTP_METHOD]: ctx.method,
    [Tags.HTTP_URL]: ctx.href,
  });
  try {
    await next();
    if (span) { finishSpan(span, ctx); }
  } catch (err) {
    if (span) { finishSpan(span, ctx, err); }
    throw err;
  }
};
