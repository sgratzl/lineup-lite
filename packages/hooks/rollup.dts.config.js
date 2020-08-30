import css from 'rollup-plugin-css-only';
import dts from 'rollup-plugin-dts';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  plugins: [
    dts({
      respectExternal: true,
    }),
    css({
      output: false,
    }),
  ],
};
