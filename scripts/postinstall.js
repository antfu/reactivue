import { readFile, readdir, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { join } from 'path'
const require = createRequire(import.meta.url)
const runtime = require.resolve('@vue/runtime-core')
const runtimeDist = join(runtime, '../dist')
const files = await readdir(runtimeDist)
const exports = ['setCurrentInstance', 'unsetCurrentInstance', 'currentInstance', 'createHook']
const getExports = isEsm => exports.map(e => isEsm ? `export { ${e} };` : `exports.${e} = ${e};`).join('\n')
for (const file of files) {
  let content = await readFile(join(runtimeDist, file), 'utf8')
  if (file.endsWith('js') && !content.match(/export.*setCurrentInstance/))
    content += `\n${getExports(file.includes('esm'))}`

  if (file.endsWith('d.ts') && !content.match(/VNodeDisabled/))
    content = content.replace(/export declare interface VNode/g, 'export declare interface VNodeDisabled')

  writeFile(join(runtimeDist, file), content, 'utf8')
}
