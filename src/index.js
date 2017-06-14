// @flow
import * as t from 'babel-types'
import template from 'babel-template'
import syntaxFlow from 'babel-plugin-syntax-flow'
import { removeFlowComment } from 'babel-add-flow-comments'

const CREATE_REDUX_ACTION_TYPE = Symbol('CREATE_REDUX_ACTION_TYPE')

/* ::
type FileMap = Map<string, string>
*/

const buildAction = template(
  `
  export const NAME = VALUE
`,
  { sourceType: 'module', plugins: ['flow'] }
)

function trimType(target /* : string */) {
  if (target.endsWith('_TYPE')) {
    return target.replace(/_TYPE$/, '')
  }
  return target
}

function isActionType(node /* : Object */) {
  const { id, right } = node
  if (
    id.name &&
    id.name.endsWith('_TYPE') &&
    right &&
    right.type &&
    right.type === 'StringLiteralTypeAnnotation'
  ) {
    return true
  }
  return false
}

function generateVariable({ node }, state) {
  if (!isActionType(node)) {
    return
  }

  const { id: { name }, right } = node

  const map /* : FileMap */ = state.file.get(CREATE_REDUX_ACTION_TYPE)

  const nameNode = t.identifier(trimType(name))

  nameNode.typeAnnotation = t.typeAnnotation(
    t.genericTypeAnnotation(t.identifier(name))
  )

  map.set(
    name,
    buildAction({
      NAME: nameNode,
      VALUE: t.stringLiteral(right.value),
    })
  )
}

export default () => {
  return {
    inherits: syntaxFlow,
    pre(file /* : Object */) {
      file.set(CREATE_REDUX_ACTION_TYPE, new Map())
    },
    visitor: {
      Program: {
        exit(path /* : Object */, { opts, file } /* : Object */) {
          removeFlowComment(file.ast.comments)
          const map /* :FileMap */ = file.get(CREATE_REDUX_ACTION_TYPE)

          const specifiers = []
          for (const action of map.keys()) {
            specifiers.push(
              t.importSpecifier(t.identifier(action), t.identifier(action))
            )
          }

          const filename = opts.filename || file.opts.filename

          const im = t.importDeclaration(
            specifiers,
            t.stringLiteral(`./${filename}`)
          )
          // $FlowFixMe
          im.importKind = 'type'
          // $FlowFixMe
          im.leadingComments = [{ type: 'CommentLine', value: ' @flow' }]

          path.node.body = [t.noop(), im, t.noop(), ...Array.from(map.values())]
        },
      },
      TypeAlias(path /* : Object */, state /* : Object */) {
        generateVariable(path, state)
      },
    },
  }
}
