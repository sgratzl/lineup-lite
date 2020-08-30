const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('rollup-plugin-pnp-resolve');
const cleanup = require('rollup-plugin-cleanup');
const css = require('rollup-plugin-css-only');

module.exports = {
  rollup(config, options) {
    const c = config.plugins.findIndex((d) => d.name === 'commonjs');
    if (c !== -1) {
      config.plugins.splice(c, 1);
    }
    config.plugins.splice(0, 0, resolve(), commonjs());
    config.plugins.push(
      cleanup({
        comments: ['some', 'ts', 'ts3s'],
        extensions: ['ts', 'tsx', 'js', 'jsx'],
      })
    );
    if (options.format === 'esm') {
      config.input = './src/bundle.ts';
      config.plugins.push(
        css({
          output: './dist/components.css',
        })
      );
    }
    config.output.banner = `/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */`;
    return config;
  },
};
