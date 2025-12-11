## @hoajs/context-storage

Context storage middleware for Hoa.

## Installation

```bash
$ npm i @hoajs/context-storage --save
```

## Quick Start

```js
import { Hoa } from 'hoa'
import { contextStorage, getContext } from '@hoajs/context-storage'

const app = new Hoa()
app.use(contextStorage())

app.use(async (ctx, next) => {
  ctx.state.requestId = crypto.randomUUID()
  await next()
})

app.use(async (ctx, next) => {
  log('Request start')
  await doSomething()
  log('Request end')
})

function log (msg) {
  const ctx = getContext()
  console.log(`[${ctx.state.requestId}] ${msg}`)
}

export default app
```

## Documentation

The documentation is available on [hoa-js.com](https://hoa-js.com/middleware/context-storage.html)

## Test (100% coverage)

```sh
$ npm test
```

## License

MIT
