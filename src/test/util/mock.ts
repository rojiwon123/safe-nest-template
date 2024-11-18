import { Mock, mock } from "node:test";

export const mockMethod = <T extends keyof R, R extends Record<T, (...args: any[]) => any>>(
    module: R,
    name: T,
    impl: R[T],
    times = Infinity,
) => mock.method(module, name, impl, { times }) as Mock<R[T]>;
