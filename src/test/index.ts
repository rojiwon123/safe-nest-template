import { DynamicExecutor } from "@nestia/e2e";
import api from "@project/api";

import { Backend } from "@SRC/backend";
import { config, initConfig } from "@SRC/infrastructure/config";
import { initLogger } from "@SRC/infrastructure/logger";

import { TestReport } from "./report";
import { Seed } from "./seed";

initConfig();
initLogger();

const getArg = (key: string): string | undefined => {
    const key_index = process.argv.findIndex((val) => val === key);
    if (key_index === -1 || key_index + 1 >= process.argv.length) return undefined;
    return process.argv[key_index + 1]!;
};

const pre_test = async () => {
    //  await connectPrisma();
    const backend = await Backend.start({ logger: false });
    await backend.listen();
    return backend;
};

const post_test = async (backend: Backend) => {
    await backend.end();
    await Seed.reset();
    //  await disconnectPrisma();
};

const test = async () => {
    const connection: api.IConnection = { host: `http://localhost:${config("PORT")}` };
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
    process.exitCode = await test();
    console.log("CLEAN UP");
    await post_test(backend);
    console.log("DONE! Check TEST_REPORT.md");
};

void run();
