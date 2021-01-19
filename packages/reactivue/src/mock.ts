import { InjectionKey } from '@vue/runtime-core'
import { isFunction } from '@vue/shared'
import { getCurrentInstance } from './component'
import { warn } from './errorHandling'

type PluginInstallFunction = (app: AppContext['app'], ...options: any[]) => any

export type Plugin =
  | PluginInstallFunction & { install?: PluginInstallFunction }
  | {
    install: PluginInstallFunction
  }

declare global {
  interface Window {
    __reactivue_context: AppContext
  }
}

interface AppContext {
  app: any // for devtools
  config: {
    globalProperties: Record<string, any>
  }
  provides: Record<string | symbol, any>
}

function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      globalProperties: {},
    },
    provides: {},
  }
}

export function createApp() {
  const context
    = __BROWSER__ && window.__reactivue_context
      ? window.__reactivue_context
      : createAppContext()

  if (__BROWSER__)
    window.__reactivue_context = context

  const installedPlugins = new Set()

  const app = (context.app = {
    version: '3.0.0',

    config: {
      globalProperties: {},
    },

    use(plugin: Plugin, ...options: any[]) {
      if (installedPlugins.has(plugin)) {
        __DEV__ && warn('Plugin has already been applied to target app.')
      }
      else if (plugin && isFunction(plugin.install)) {
        installedPlugins.add(plugin)
        plugin.install(app, ...options)
      }
      else if (isFunction(plugin)) {
        installedPlugins.add(plugin)
        plugin(app, ...options)
      }
      else if (__DEV__) {
        warn(
          'A plugin must either be a function or an object with an "install" '
            + 'function.',
        )
      }
      console.log(app)

      return app
    },

    provide<T>(key: InjectionKey<T> | string, value: T) {
      if (__DEV__ && (key as string | symbol) in context.provides) {
        warn(
          `App already provides property with key "${String(key)}". `
            + 'It will be overwritten with the new value.',
        )
      }
      // TypeScript doesn't allow symbols as index type
      // https://github.com/Microsoft/TypeScript/issues/24587
      context.provides[key as string] = value
    },
  })

  return app
}
export function h() {
}

export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
  const instance = getCurrentInstance()

  if (instance)
    instance.provides[key as string] = value
}

export function inject<T>(key: InjectionKey<T> | string): T | undefined
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false
): T
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true
): T
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false,
) {
  const instance = getCurrentInstance()
  console.log(instance)

  if (instance) {
    if (instance.provides && (key as string | symbol) in instance.provides) {
      // TS doesn't allow symbol as index type
      return instance.provides[key as string]
    }
    else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue()
        : defaultValue
    }
    else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  }
  else if (__DEV__) {
    warn('inject() can only be used inside setup() or functional components.')
  }
}
