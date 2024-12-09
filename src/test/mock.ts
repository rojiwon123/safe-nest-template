import sdk from "@project/sdk";
import { Either, ManagedRuntime } from "effect";
import ntest from "node:test";

import { AppModule } from "@/app/app.module";
import { EffectHandler } from "@/effect.handler";

export const mock =
    (context: {
        connection?: (cnt: sdk.IConnection) => sdk.IConnection | Promise<sdk.IConnection>;
        module?: ReturnType<typeof AppModule>;
    }) =>
    <T>(test: (cnt: sdk.IConnection, module: ReturnType<typeof AppModule>) => Promise<T>) =>
    async (connection: sdk.IConnection): Promise<T> => {
        const cnt = await (context.connection ?? ((c) => c))(connection);
        const hooks: (() => void)[] = [];

        if (context.module) {
            const module = context.module;
            const runtime = ManagedRuntime.make(module);
            const mocked = ntest.mock.method(EffectHandler, "runtime", () => runtime);
            hooks.push(() => mocked.mock.restore());
        }
        const either: Either.Either<T, unknown> = await test(cnt, context.module ?? AppModule())
            .then(Either.right)
            .catch(Either.left);
        hooks.forEach((f) => f());
        return Either.match(either, {
            onLeft(err) {
                throw err;
            },
            onRight: (i) => i,
        });
    };
