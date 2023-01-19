import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import css from '@sgratzl/rollup-plugin-css-only';
import { resolve as resolvePath, relative, dirname } from 'path';
import { cwd } from 'process';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

function resolveYear() {
  // Extract copyrights from the LICENSE.
  const license = fs.readFileSync('./LICENSE.md', 'utf-8').toString();
  const matches = Array.from(license.matchAll(/\(c\) (\d+-\d+)/gm));
  if (!matches || matches.length === 0) {
    return 2021;
  }
  return matches[matches.length - 1][1];
}
const year = resolveYear();

const banner = `/**
 * ${pkg.name}
 * ${pkg.homepage}
 *
 * Copyright (c) ${year} ${pkg.author.name} <${pkg.author.email}>
 */
`;

/**
 * defines which formats (umd, esm, cjs, types) should be built when watching
 */
const watchOnly = ['esm', 'types'];

const isDependency = (v) =>
  !v.endsWith('css') && Object.keys(pkg.dependencies || {}).some((e) => e === v || v.startsWith(e + '/'));
const isPeerDependency = (v) => Object.keys(pkg.peerDependencies || {}).some((e) => e === v || v.startsWith(e + '/'));

const relativeToMain = (path) => {
  const a = resolvePath(cwd(), path);
  const b = resolvePath(cwd(), dirname(pkg.main));
  return relative(b, a);
};
export default function Config(options) {
  const buildFormat = (format) => !options.watch || watchOnly.includes(format);

  const base = {
    input: './src/index.ts',
    output: {
      sourcemap: true,
      banner,
      globals: {},
      exports: 'named',
    },
    external: (v) => isDependency(v) || isPeerDependency(v),
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          // eslint-disable-next-line no-undef
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'production',
          __VERSION__: JSON.stringify(pkg.version),
        },
      }),
      pkg.styles &&
        css({
          output: relativeToMain(pkg.styles),
        }),
    ].filter(Boolean),
  };
  return [
    (buildFormat('esm') || buildFormat('cjs')) && {
      ...base,
      input: base.input.replace('.ts', '.style.ts'),
      output: [
        buildFormat('esm') && {
          ...base.output,
          file: pkg.module,
          format: 'esm',
        },
        buildFormat('cjs') && {
          ...base.output,
          file: pkg.require,
          format: 'cjs',
        },
      ].filter(Boolean),
    },
    buildFormat('umd') &&
      pkg.unpkg && {
        ...base,
        input: fs.existsSync(base.input.replace('.ts', '.umd.ts')) ? base.input.replace('.ts', '.umd.ts') : base.input,
        output: [
          {
            ...base.output,
            file: pkg.unpkg,
            format: 'umd',
            name: pkg.global,
          },
          {
            ...base.output,
            file: pkg.unpkg.replace('.js', '.min.js'),
            format: 'umd',
            name: pkg.global,
            plugins: [terser()],
          },
        ],
        external: (v) => isPeerDependency(v),
        plugins: [...base.plugins, babel({ presets: ['@babel/env'], babelHelpers: 'bundled' })],
      },
    buildFormat('types') && {
      ...base,
      output: {
        ...base.output,
        file: pkg.types,
        format: 'es',
      },
      plugins: [
        dts({
          compilerOptions: {
            removeComments: false,
          },
          respectExternal: true,
        }),
        pkg.styles &&
          css({
            output: false,
          }),
      ].filter(Boolean),
    },
  ].filter(Boolean);
}
