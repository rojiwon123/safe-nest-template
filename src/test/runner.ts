import { DynamicExecutor } from "@nestia/e2e";
import { IConnection } from "@nestia/fetcher";

import { Report } from "./internal/report";

export const runTest = async (connection: IConnection): Promise<0 | -1> => {
    const only_option = process.argv.find((exe) => exe.startsWith("--only="));
    const report = await DynamicExecutor.validate({
        prefix: "test_",
        parameters: () => [connection],
        wrapper: async (_, closure) => {
            try {
                await closure(connection);
            } catch (error) {
                delete (error as Error).stack;
                console.log(error);
                throw error;
            }
        },
        ...(only_option
            ? { filter: (name) => name.includes(only_option.slice(7)) }
            : {}),
    })(__dirname + "/features");
    console.log();
    const result = Report.analyze(report);
    if (result.result === 0) {
        console.log(
            "✅",
            Report.color("Cyan")(result.count),
            Report.color("Green")("Tests Passed"),
        );
        console.log("Total Elapsed time", result.time, "ms");
    } else {
        console.log(
            "❌",
            Report.color("LightRed")(result.failed_count),
            Report.color("Red")("in"),
            Report.color("Cyan")(result.total_count),
            Report.color("Red")("Tests Failed"),
        );
    }
    if (process.argv.includes("--report")) Report.log(result);
    return result.result;
};
