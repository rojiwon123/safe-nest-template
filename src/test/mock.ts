/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { isNil } from "@fxts/core";
import { mock } from "node:test";

import api from "../../packages/sdk";

export namespace Mock {
    export type MockFn = ReturnType<typeof mock.method>;
    type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
    export const impl = <Module extends object, Name extends FunctionPropertyNames<Module>>(
        module: Module,
        name: Name,
        fn: Module[Name],
        times = Infinity,
    ): MockFn => {
        restore(module, name);
        return mock.method(module, name, fn as Function, { times });
    };
    export const restore = <Module extends object, Name extends FunctionPropertyNames<Module>>(module: Module, name: Name): void => {
        const fn = (module[name] as MockFn)["mock"];
        if (isNil(fn)) return;
        fn.restore();
    };

    export const wrap =
        <T>(input: { before: () => T | Promise<T>; after: () => unknown | Promise<unknown> }) =>
        <R>(fn: (connection: api.IConnection, context: T) => Promise<R>) =>
        async (connection: api.IConnection) => {
            try {
                const context = await input.before();
                const result = await fn(connection, context);
                await input.after();
                return result;
            } catch (error: unknown) {
                await input.after();
                throw error;
            }
        };
}
