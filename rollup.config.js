const babel = require('rollup-plugin-babel');
const rollup = require('rollup').rollup;
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const cleanup = require('rollup-plugin-cleanup');
const commonjs = require('rollup-plugin-commonjs');
const minify = require('rollup-plugin-minify');
const replace = require('rollup-plugin-replace');

export default {
  entry: 'espruino/src/main.js',
  dest: 'espruino/lib/main.min.js',
  format: 'cjs',
//  sourceMap: 'inline',
  plugins: [
    json(),
    cleanup(),
    replace({
      SERIAL_DEV: JSON.stringify( '/dev/ttyS0' )
    }),
    nodeResolve({
      main: true,
      skip: [ 'NetworkJS', 'wifi' ]
    }),
      commonjs({
      namedExports: {
        'espruino/src/SIM900/SIM900.js': [ 'SIM900' ],
        'espruino/src/SIM900/AT.js': [ 'AT' ],
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          "es2015-rollup"
        ]
      ],
      plugins: [
        "external-helpers"
      ]
    })
  ],
};