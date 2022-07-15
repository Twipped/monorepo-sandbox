import path from 'path';
import enhancedResolve from 'enhanced-resolve';

const resolver = (source, options) => {
  // first attempt to perform a modern commonjs resolution
  const resolve = enhancedResolve.create.sync({
    extensions: ['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.json', '.node'],
    modules: options.moduleDirectory,
    roots: [path.resolve(__dirname, '../..')],
    conditionNames: ['node', 'require']
  });

  let res;
  try {
    res = resolve(options.basedir, source);
    if (res) return res;
  } catch (e) {
    res = false;
  }

  // that didn't work, so lets try doing it again, but ignore the exports field in package.json
  const resolve2 = enhancedResolve.create.sync({
    extensions: ['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.json', '.node'],
    modules: options.moduleDirectory,
    roots: [path.resolve(__dirname, '../..')],
    conditionNames: ['node', 'require'],
    exportsFields: []
  });

  try {
    res = resolve2(options.basedir, source);
    if (res) return res;
  } catch (e) {
    res = false;
  }

  // still didn't see it, so just fall back to jest's own resolver
  return options.defaultResolver(source, options);
};

export default resolver;
