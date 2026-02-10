import type { HoaMiddleware, HoaContext } from 'hoa'

type MaybePromise<T> = T | Promise<T>

export declare function contextStorage (): HoaMiddleware

export declare function getContext (): HoaContext

export declare function MockContext<T = unknown> (ctx: HoaContext, next: () => MaybePromise<T>): MaybePromise<T>