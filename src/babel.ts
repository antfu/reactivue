import type * as types from '@babel/types'

function isComponentishName(name: string) {
  return typeof name === 'string' && name[0] >= 'A' && name[0] <= 'Z'
}

type ReactivueBabelOptions = {
  /**
   * @default false
   */
  arrowFunctionAsComponent?: boolean

  /**
   * @default true
   */
  autoWrapComputed?: boolean
}

export default ({
  arrowFunctionAsComponent = false,
  autoWrapComputed = true,
}: ReactivueBabelOptions = {}) =>
  ({ types: t }: { types: typeof types }) => {
    return {
      visitor: {
        Expression(path: any) {
          if (arrowFunctionAsComponent && t.isArrowFunctionExpression(path.node)) {
            if (t.isVariableDeclarator(path.parent)) {
              if (isComponentishName(path.parent.id.name))
                path.replaceWith(t.callExpression(t.identifier('defineComponent'), [path.node]))
            }
          }

          if (
            autoWrapComputed
            && path.node.name === 'defineComponent'
            && path.parent.arguments?.length === 1
          ) {
            const parentArgument = path.parent.arguments[0]
            const fnBody = parentArgument.type.endsWith('FunctionExpression')
              ? parentArgument.body.body // preact
              : parentArgument.right.body.body // react
            if (
              t.isReturnStatement(fnBody?.[fnBody.length - 1])
              && fnBody[fnBody.length - 1].argument.callee.name !== 'computed'
            ) {
              fnBody[fnBody.length - 1] = t.returnStatement(
                t.callExpression(t.identifier('computed'), [
                  t.arrowFunctionExpression([], fnBody[fnBody.length - 1].argument),
                ]),
              )
            }
          }
        },
      },
    }
  }

export const reactivueImports = [
  {
    reactivue: ['defineComponent', 'onPropsUpdated'],
  },
  {
    '@vue/runtime-core': [
      // lifecycle
      'onBeforeMount',
      'onBeforeUnmount',
      'onBeforeUpdate',
      'onMounted',
      'onUnmounted',
      'onUpdated',

      // reactivity,
      'computed',
      'customRef',
      'isReadonly',
      'isRef',
      'markRaw',
      'reactive',
      'readonly',
      'ref',
      'shallowReactive',
      'shallowReadonly',
      'shallowRef',
      'triggerRef',
      'toRaw',
      'toRef',
      'toRefs',
      'unref',
      'watch',
      'watchEffect',

      // component
      'getCurrentInstance',
      'inject',
      'nextTick',
      'provide',

      // effect scope
      'effectScope',
      'EffectScope',
      'getCurrentScope',
      'onScopeDispose',
    ],
  },
] as const
