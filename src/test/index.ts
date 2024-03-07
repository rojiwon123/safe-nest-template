import { Backend } from '@SRC/backend';
import { Configuration } from '@SRC/infrastructure/config';
import { DynamicExecutor } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';

import { TestAnalyzer } from './internal/analyzer';

const getArg = (key: string): string | undefined => {
    const key_index = process.argv.findIndex((val) => val === key);
    if (key_index === -1 || key_index + 1 >= process.argv.length)
        return undefined;
    return process.argv[key_index + 1]!;
};

void (async () => {
    // Mocker.run();
    const app = await Backend.create({ logger: false });
    await app.open();
    const connection: IConnection = {
        host: `http://localhost:${Configuration.PORT}`,
    };
    const features = __dirname + '/features';
    const skip = getArg('--skip');
    const only = getArg('--only');
    const report = await DynamicExecutor.validate({
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
    })(features);
    await app.close();

    const analyzed = TestAnalyzer.analyze(report);
    const md = process.argv.includes('-f');
    TestAnalyzer.report(analyzed, md);
    process.exit(analyzed.state);
})();
