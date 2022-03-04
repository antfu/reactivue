import type * as types from '@babel/types'

export default ({ types: t }: { types: typeof types }) => {
  return {
    visitor: {
      Identifier(path: any) {
        if (path.node.name === 'defineComponent' && path.parent.arguments?.length === 1) {
          const parentArgument = path.parent.arguments[0]
          const fnBody = parentArgument.type === 'ArrowFunctionExpression' ? parentArgument.body.body : parentArgument.right.body.body
          if (fnBody && fnBody[fnBody.length - 1].argument.callee.name !== 'computed') {
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
