import { jest } from '@jest/globals'
import { Hoa } from 'hoa'
import { contextStorage, getContext, MockContext } from '../src/context-storage.js'

function doSomething () {
  return new Promise(resolve => setTimeout(resolve, 100))
}

describe('Context Storage Middleware', () => {
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

  it('should get context inside middleware', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await app.fetch(new Request('http://localhost/'))
    const calls = spy.mock.calls.map(call => call[0])

    expect(calls.length).toBeGreaterThanOrEqual(2)

    const [startLog, endLog] = calls

    expect(startLog).toMatch(/Request start/)
    expect(endLog).toMatch(/Request end/)

    const startIdMatch = startLog.match(/\[(.+?)\]/)
    const endIdMatch = endLog.match(/\[(.+?)\]/)

    expect(startIdMatch).not.toBeNull()
    expect(endIdMatch).not.toBeNull()
    expect(startIdMatch[1]).toBe(endIdMatch[1])

    spy.mockRestore()
  })

  it('should throw when context is not available', () => {
    expect(() => getContext()).toThrow('Context is not available')
  })

  it('MockContext should provide context inside next', async () => {
    const ctx = { state: { requestId: 'mock-1' } }
    const value = await MockContext(ctx, async () => {
      const stored = getContext()
      return stored.state.requestId
    })

    expect(value).toBe('mock-1')
  })

  it('MockContext should isolate contexts between concurrent runs', async () => {
    const ctx1 = { state: { requestId: 'c1' } }
    const ctx2 = { state: { requestId: 'c2' } }

    const [r1, r2] = await Promise.all([
      MockContext(ctx1, async () => {
        await doSomething()
        return getContext().state.requestId
      }),
      MockContext(ctx2, async () => {
        await doSomething()
        return getContext().state.requestId
      })
    ])

    expect(r1).toBe('c1')
    expect(r2).toBe('c2')
  })
})
