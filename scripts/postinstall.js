import { readFile, readdir, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { dirname, join } from 'path'
const require = createRequire(import.meta.url)
const runtime = require.resolve('@vue/runtime-core')
const runtimeDist = join(runtime, '../dist')
const files = (await readdir(runtimeDist)).filter(file => file.endsWith('.js'))
const exports = ['setCurrentInstance', 'unsetCurrentInstance', 'currentInstance', 'createHook']
const getExports = isEsm => exports.map(e => isEsm ? `export { ${e} };` : `exports.${e} = ${e};`).join('\n')
for (const file of files) {
  let content = await readFile(join(runtimeDist, file), 'utf8')
  if (content.match(/export.*setCurrentInstance/))
    continue
  content += `\n${getExports(file.includes('esm'))}`
  writeFile(join(runtimeDist, file), content, 'utf8')
}

// Remove Vue JSX Types
const runtimedom = require.resolve('@vue/runtime-dom')
const runtimedomTypes = join(dirname(runtimedom), './dist/runtime-dom.d.ts')
const runtimedomContent = await readFile(runtimedomTypes, 'utf8')
writeFile(runtimedomTypes, runtimedomContent.replace(/export { }[\s\S]*export {}/g, 'export {}'), 'utf8')
