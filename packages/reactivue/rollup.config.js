import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

const external = ['@vue/reactivity', 'react', 'preact/hooks']
const replacements = {
  __DEV__: '(typeof process !== \'undefined\' && process.env.NODE_ENV === \'development\')',
  __BROWSER__: '(typeof window !== \'undefined\')',
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
      },
    ],
    plugins: [replace({ ...replacements }), resolve(), typescript()],
    external,
    onwarn(msg, warn) {
      if (!/Circular/.test(msg))
        warn(msg)
    },
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'preact/index.js',
        format: 'cjs',
      },
      {
        file: 'preact/index.esm.js',
        format: 'es',
      },
    ],
    plugins: [replace({ react: 'preact/hooks', ...replacements }), resolve(), typescript()],
    external,
    onwarn(msg, warn) {
      if (!/Circular/.test(msg))
        warn(msg)
    },
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
      {
        file: 'preact/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
    external,
  },
]
