import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage()

export function contextStorage () {
  return async function contextStorageMiddleware (ctx, next) {
    await asyncLocalStorage.run(ctx, next)
  }
}

export function getContext () {
  const context = asyncLocalStorage.getStore()
  if (!context) {
    throw new Error('Context is not available')
  }
  return context
}
