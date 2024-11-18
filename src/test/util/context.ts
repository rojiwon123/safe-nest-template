import sdk from "@project/sdk";

export const context =
    <Before>(context: {
        connection?: (cnt: sdk.IConnection) => sdk.IConnection | Promise<sdk.IConnection>;
        before?: (cnt: sdk.IConnection) => Before | Promise<Before>;
        after?: (input: { before: Awaited<Before> | null; connection: sdk.IConnection }) => Promise<void>;
    }) =>
    <T>(test: (connection: sdk.IConnection, before: Before | null) => Promise<T>) =>
    async (connection: sdk.IConnection) => {
        try {
            const cnt = await (context.connection ?? ((c) => c))(connection);
            const before = await (context.before ?? (async () => null))(cnt);
            try {
                const actual = await test(cnt, before);
                await (context.after ?? (() => {}))({ before, connection });
                return actual;
            } catch (error: unknown) {
                await (context.after ?? (() => {}))({ before, connection });
                throw error;
            }
        } catch (err: unknown) {
            await (context.after ?? (() => {}))({ before: null, connection });
            throw err;
        }
    };
