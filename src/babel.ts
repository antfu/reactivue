import type * as types from '@babel/types'

export default ({ types: t }: { types: typeof types }) => {
  return {
    visitor: {
      Identifier(path: any) {
        if (path.node.name === 'defineComponent' && path.parent.arguments?.length === 1) {
          const fnBody = path.parent.arguments[0].right.body.body
          fnBody[fnBody.length - 1] = t.returnStatement(
            t.callExpression(t.identifier('computed'), [
              t.arrowFunctionExpression([], fnBody[fnBody.length - 1].argument),
            ]),
          )
        }
      },
    },
  }
}
