import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'

const external = ['@vue/reactivity', 'react']

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
    plugins: [resolve(), typescript()],
    external,
    onwarn(msg, warn) {
      if (!/Circular/.test(msg))
        warn(msg)
    },
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
    external,
  },
]
