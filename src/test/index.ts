import { DynamicExecutor } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';

import { Backend } from '@SRC/backend';
import { config, initConfig } from '@SRC/infrastructure/config';
import { connectPrisma, disconnectPrisma } from '@SRC/infrastructure/db/prisma';
import { initLogger } from '@SRC/infrastructure/logger';

import { TestAnalyzer } from './internal/analyzer';

const getArg = (key: string): string | undefined => {
    const key_index = process.argv.findIndex((val) => val === key);
    if (key_index === -1 || key_index + 1 >= process.argv.length)
        return undefined;
    return process.argv[key_index + 1]!;
};

void (async () => {
    // Mocker.run();
    initConfig();
    initLogger();
    const backend = await Backend.start({
        logger: false,
        preStart: connectPrisma,
        postEnd: disconnectPrisma,
    });
    const connection: IConnection = {
        host: `http://localhost:${config('PORT')}`,
    };
    const skip = getArg('--skip');
    const only = getArg('--only');
    const report = await DynamicExecutor.validate({
        location: __dirname + '/features',
        prefix: 'test_',
        parameters: () => [connection],
        filter: (name) => {
            if (skip !== undefined) return !name.includes(skip);
            if (only !== undefined) return name.includes(only);
            return true;
        },
        wrapper: async (_, closure) => {
            try {
                await closure(connection);
            } catch (error) {
                if (error instanceof Error) delete error.stack;
                console.log(error);
                throw error;
            }
        },
    });

    await backend.end();

    const analyzed = TestAnalyzer.analyze(report);
    const md = process.argv.includes('--report');
    TestAnalyzer.report(analyzed, md);
    process.exit(analyzed.state);
})();
