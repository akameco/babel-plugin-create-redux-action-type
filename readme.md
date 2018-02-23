# babel-plugin-create-redux-action-type [![Build Status](https://travis-ci.org/akameco/babel-plugin-create-redux-action-type.svg?branch=master)](https://travis-ci.org/akameco/babel-plugin-create-redux-action-type)

[![Greenkeeper badge](https://badges.greenkeeper.io/akameco/babel-plugin-create-redux-action-type.svg)](https://greenkeeper.io/)

> create redux action type constants


## Install

#### yarn

```
$ yarn add --dev babel-plugin-create-redux-action-type
```

#### npm

```
$ npm install --save-dev babel-plugin-create-redux-action-type
```

## Example

In:

```js
/* @flow */
type HOGE_TYPE = 'hoge/HOGE_ACTION'
type FUGA_TYPE = 'fuga/FUGA_ACTION'

type Action = { +type: HOGE_TYPE | HUGA_TYPE }
```

Out:

```js
// @flow
import type { HOGE_TYPE, FUGA_TYPE } from './actionTypes';

export const HOGE: HOGE_TYPE = 'hoge/HOGE_ACTION';
export const FUGA: FUGA_TYPE = 'fuga/FUGA_ACTION';"
```


## Usage

```json
{
  "plugins": [
    "create-redux-action-type"
  ]
}
```

## License

MIT © [akameco](http://akameco.github.io)
