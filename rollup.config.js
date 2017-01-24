const babel = require('rollup-plugin-babel');
const rollup = require('rollup').rollup;
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const cleanup = require('rollup-plugin-cleanup');
const commonjs = require('rollup-plugin-commonjs');
const minify = require('rollup-plugin-minify');
const replace = require('rollup-plugin-replace');

export default {
  entry: 'src/main.js',
  dest: 'lib/main.min.js',
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
      skip: [ 'NetworkJS' ]
    }),
      commonjs({
      namedExports: {
        'src/SIM900/SIM900.js': [ 'SIM900' ],
        'src/SIM900/AT.js': [ 'AT' ],
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          "es2015",
          {
            "modules": false
          }
        ]
      ],
      plugins: [
        "external-helpers"
      ]
    })
  ],
};