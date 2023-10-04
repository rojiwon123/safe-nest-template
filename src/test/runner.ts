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
import api from "@project/api";

import { Backend } from "@APP/application";
import { Configuration } from "@APP/infrastructure/config";

import { ITarget } from "./internal/type";
import { Util } from "./internal/utils";

const test = async (connection: ITarget): Promise<boolean> => {
    Util.md.header()("Test Report");

    const report = await DynamicExecutor.validate({
        prefix: "test",
        parameters: () => [connection],
    })(__dirname + "/features");

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

    Util.md.toggleClose();

    if (isEmpty(executions)) {
        console.log("✅ \x1b[32mAll Tests Passed\x1b[0m");
        console.log(`Test Count: \x1b[36m${report.executions.length}\x1b[0m`);
        console.log(
            `Total Test Time: \x1b[33m${report.time.toLocaleString()}\x1b[0m ms`,
        );
        return true;
    } else {
        console.log(`❌ \x1b[31m${executions.length} Tests have Failed\x1b[0m`);

        pipe(
            executions,

            groupBy((exe) => exe.location),

            (input) => Object.entries(input),

            sort(([a], [b]) => a.localeCompare(b)),

            each(([location, exes]) => {
                Util.md.title(location);
                each(({ name, error }) => {
                    console.log("- " + name);
                    Util.md.bash(`${error.name}: ${error.message}`);
                }, exes);
            }),
        );

        Util.md.toggleClose();
        return false;
    }
};

export const run = async () => {
    const app = await Backend.start({ logger: false });
    const connection: ITarget = {
        host: `http://localhost:${Configuration.PORT}`,
    };

    const response = await api.functional.health.get(connection);

    if (!response.success) {
        await Backend.end(app);
        console.log("Server can't active");
        process.exit(-1);
    } else {
        const state = await Util.log(() => test(connection))(
            __dirname + "/../../test_log.md",
        );
        await Backend.end(app);
        process.exit(state ? 0 : -1);
    }
};
