// @flow
import { transform } from 'babel-core'
import plugin from '../src'

function transformCode(input /* : string */, opts /* : ?Object */ = {}) {
  const { code } = transform(input, {
    babelrc: false,
    plugins: [[plugin, opts]],
  })
  return code
}

test('add flow comments', () => {
  const input = `
type HOGE_TYPE = 'hoge/HOGE_ACTION'
  `
  expect(transformCode(input)).toMatchSnapshot()
})

test('add flow comments when exits flow comments', () => {
  const input = `
// @flow
type HOGE_TYPE = 'hoge/HOGE_ACTION'
type FUGA_TYPE = 'fuga/FUGA_ACTION'
  `
  expect(transformCode(input)).toMatchSnapshot()
})

test('add flow comments when exits flow block comments', () => {
  const input = `
/* @flow */
type HOGE_TYPE = 'hoge/HOGE_ACTION'
type FUGA_TYPE = 'fuga/FUGA_ACTION'
  `
  expect(transformCode(input)).toMatchSnapshot()
})

test('with extra', () => {
  const input = `
/* @flow */
type HOGE_TYPE = 'hoge/HOGE_ACTION'
type FUGA_TYPE = 'fuga/FUGA_ACTION'

const hoge = 'hoge'
const fuga = 'fuga'

type Action = { +type: HOGE_TYPE | HUGA_TYPE }
  `
  expect(transformCode(input)).toMatchSnapshot()
})

test('opts.filename', () => {
  const input = `
/* @flow */
type HOGE_TYPE = 'hoge/HOGE_ACTION'
type FUGA_TYPE = 'fuga/FUGA_ACTION'

const hoge = 'hoge'
const fuga = 'fuga'

type Action = { +type: HOGE_TYPE | HUGA_TYPE }
  `
  expect(transformCode(input, { filename: 'actionTypes' })).toMatchSnapshot()
})

test('export', () => {
  const input = `
/* @flow */
export type HOGE_TYPE = 'hoge/HOGE_ACTION'
export type FUGA_TYPE = 'fuga/FUGA_ACTION'

type Action = { +type: HOGE_TYPE | HUGA_TYPE }
  `
  expect(transformCode(input, { filename: 'actionTypes' })).toMatchSnapshot()
})

test('real world', () => {
  const input = `
// @flow
export type ADD_HOGE_TYPE = 'Hoge/ADD'
export type DELETE_HOGE_TYPE = 'Hoge/DELETE'
export type EDIT_HOGE_TYPE = 'Hoge/EDIT'

export type Action =
  | {| +type: ADD_HOGE_TYPE | EDIT_HOGE_TYPE |}
  | {| +type: DELETE_HOGE_TYPE, +id: number |}
  `
  expect(transformCode(input, { filename: 'actionTypes' })).toMatchSnapshot()
})
