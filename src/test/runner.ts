import {
    each,
    filter,
    groupBy,
    isEmpty,
    isNull,
    negate,
    pipe,
    sort,
    toArray,
} from "@fxts/core";
import { DynamicExecutor } from "@nestia/e2e";
import { IConnection } from "@nestia/fetcher";
import { createWriteStream } from "fs";
import path from "path";
import stripAnsi from "strip-ansi";

import { Backend } from "@APP/application";
import { Configuration } from "@APP/infrastructure/config";

const logger = createWriteStream(path.join(__dirname, "./../../test_log.md"), {
    flags: "w",
});

const write = process.stdout.write.bind(process.stdout);
process.stdout.write = (str: string) => {
    logger.write(stripAnsi(str));
    return write(str);
};

const test = async (connection: IConnection): Promise<0 | -1> => {
    const report = await DynamicExecutor.validate({
        prefix: "test",
        parameters: () => [connection],
    })(__dirname + "/features");

    const a: Error | null = {} as any;
    if (negate(isNull)(a)) {
        a;
    }

    const executions = pipe(
        report.executions,

        filter(
            (
                execution,
            ): execution is DynamicExecutor.IReport.IExecution & {
                error: Error;
            } => negate(isNull)(execution.error),
        ),

        toArray,
    );

    logger.write("\n</details>");
    console.log();

    if (isEmpty(executions)) {
        console.log("✅ \x1b[32mAll Tests Passed\x1b[0m");
        console.log(`Test Count: \x1b[36m${report.executions.length}\x1b[0m`);
        console.log(
            `Total Test Time: \x1b[33m${report.time.toLocaleString()}\x1b[0mms`,
        );
        return 0;
    } else {
        console.log(`❌ \x1b[31m${executions.length} Tests have Failed\x1b[0m`);

        pipe(
            executions,

            groupBy((exe) => exe.location),

            (input) => Object.entries(input),

            sort(([a], [b]) => a.localeCompare(b)),

            each(([location, exes]) => {
                console.log(
                    "\n\x1b[33mLocation:\x1b[0m " +
                        location.split("/features")[1],
                );
                each(({ name, error }) => {
                    console.log("\n- \x1b[34mFunction:\x1b[0m " + name);
                    console.error();
                    console.error(error);
                }, exes);
            }),
        );

        return -1;
    }
};

export const run = async () => {
    const app = await Backend.start({ logger: false });
    const connection: IConnection = {
        host: `http://localhost:${Configuration.PORT}`,
    };

    console.log("# Test Report");
    logger.write("\n<details>\n<summary>detail test case</summary>\n\n");

    const code = await test(connection).catch((err) => {
        console.log(err);
        return -1 as const;
    });

    logger.end();

    await Backend.end(app);

    process.exit(code);
};
