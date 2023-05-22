import typescript from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

const external = [
  '@vue/reactivity',
  '@vue/shared',
  '@vue/runtime-core',
  'react',
  'preact/hooks',
]

const __DEV__ = '(process.env.NODE_ENV === \'development\')'
const __BROWSER__ = '(typeof window !== \'undefined\')'

const onwarn = (msg, warn) => !/Circular|preventAssignment/.test(msg) && warn(msg)

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
    ],
    plugins: [replace({ __DEV__, __BROWSER__ }), resolve(), typescript()],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'preact/index.js',
        format: 'cjs',
      },
    ],
    plugins: [
      replace({ react: 'preact/hooks', __DEV__, __BROWSER__ }),
      resolve(),
      typescript(),
    ],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      replace({ __DEV__, __BROWSER__ }),
      resolve(),
      typescript(),
    ],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'preact/index.mjs',
        format: 'es',
      },
    ],
    plugins: [replace({ react: 'preact/hooks', __DEV__, __BROWSER__ }), resolve(), typescript()],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.module.js',
        format: 'es',
      },
    ],
    plugins: [replace({ __DEV__: false, __BROWSER__: true }), resolve(), typescript(), terser()],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'preact/index.module.js',
        format: 'es',
      },
    ],
    plugins: [replace({ react: 'preact/hooks', __DEV__: false, __BROWSER__: true }), resolve(), typescript(), terser()],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.module.dev.js',
        format: 'es',
      },
    ],
    plugins: [replace({ __DEV__, __BROWSER__ }), resolve(), typescript()],
    external,
    onwarn,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'preact/index.module.dev.js',
        format: 'es',
      },
    ],
    plugins: [replace({ react: 'preact/hooks', __DEV__, __BROWSER__ }), resolve(), typescript()],
    external,
    onwarn,
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
