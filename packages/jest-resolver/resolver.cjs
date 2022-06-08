// eslint-disable-next-line import/no-nodejs-modules
const path = require('path');
const enhancedResolve = require('enhanced-resolve');

module.exports = (source, opts) => {
  const resolve = enhancedResolve.create.sync({
    extensions: ['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.json', '.node'],
    modules: opts.moduleDirectory,
    roots: [path.resolve(__dirname, '../..')]
  });

  let res;
  try {
    res = resolve(opts.basedir, source);
  } catch (e) {
    res = false;
  }

  if (!res) res = opts.defaultResolver(source, opts);
  return res;
};
