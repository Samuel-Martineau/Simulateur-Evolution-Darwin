module.exports = (env, options) => {
  const environment = options.mode;
  if (environment === 'development') {
    return require('./webpack/webpack.dev.config.js');
  } else {
    return require('./webpack/webpack.prod.config.js');
  }
};
