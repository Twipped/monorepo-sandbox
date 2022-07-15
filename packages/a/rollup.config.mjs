/* eslint-disable import/no-extraneous-dependencies */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'index.mjs',
    output: {
      file: 'index.cjs',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      resolve(),
      commonjs(),
    ],
  },
];
