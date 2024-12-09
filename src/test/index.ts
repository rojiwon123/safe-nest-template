import { DynamicExecutor } from "@nestia/e2e";
import sdk from "@project/sdk";

import { Backend, createBackend } from "@/backend";
import { config } from "@/infrastructure/config";

import { TestReport } from "./report";

const getArg = (key: string): string | undefined => {
    const key_index = process.argv.findIndex((val) => val === key);
    if (key_index === -1 || key_index + 1 >= process.argv.length) return undefined;
    return process.argv[key_index + 1]!;
};

const pre_test = async () => {
    const backend = await createBackend({ logger: false });
    await backend.start();
    return backend;
};

const post_test = async (backend: Backend) => {
    await backend.end();
};

const execute = async () => {
    const connection: sdk.IConnection = { host: `http://localhost:${config("PORT")}` };
    const skip = getArg("--skip");
    const only = getArg("--only");
    const report = await DynamicExecutor.validate({
        prefix: "test",
        location: __dirname + "/features",
        parameters: () => [connection],
        filter: (name) => {
            if (skip !== undefined) return !name.includes(skip);
            if (only !== undefined) return name.includes(only);
            return true;
        },
    });
    return TestReport.report(report);
};

export const run = async () => {
    console.log("SETUP");
    const backend = await pre_test();
    console.log("TESTING ...");
    const exitCode = await execute();
    console.log("CLEAN UP");
    await post_test(backend);
    console.log(`${exitCode === 0 ? "Successed!" : "Failed"}! Check TEST_REPORT.md`);
    process.exitCode = exitCode;
};

void run();
