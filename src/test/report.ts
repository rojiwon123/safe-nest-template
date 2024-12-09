import { DynamicExecutor } from "@nestia/e2e";
import { isNull } from "effect/Predicate";
import { appendFileSync, writeFileSync } from "fs";

export namespace TestReport {
    export type report = (input: DynamicExecutor.IReport) => 0 | -1;
    export const report: report = (input) => {
        init();
        const fail_cases = input.executions.filter((exec): exec is DynamicExecutor.IExecution & { error: Error } => !isNull(exec.error));
        log(`# Test Report at ${new Date().toISOString()}\n`);
        log("## Summary\n");
        log("| Total | Success | Fail | Duration |");
        log("| ----- | --------- | ------ | -------- |");
        log(`| ${input.executions.length} | ${input.executions.length - fail_cases.length} | ${fail_cases.length} | ${input.time} ms |`);
        log();
        success_report(input);
        log();
        failed_report(input);
        return fail_cases.length > 0 ? -1 : 0;
    };

    const success_report = (input: DynamicExecutor.IReport) => {
        log("## Success Cases\n");
        log("<details>");
        log();
        log("| Name | Location | Duration |");
        log("| ---- | -------- | -------- |");
        input.executions.forEach((exec) =>
            isNull(exec.error) ?
                log(
                    `| ${exec.name} | ${exec.location.slice(input.location.length, -3)} | ${new Date(exec.completed_at).getTime() - new Date(exec.started_at).getTime()} ms |`,
                )
            :   null,
        );
        log();
        log("</details>");
    };
    const failed_report = (input: DynamicExecutor.IReport) => {
        log("## Fail Cases\n");
        log("<details>");
        log();
        log("| Name | Location | Error | message |");
        log("| ---- | -------- | ----- | ------- |");
        input.executions.forEach((exec) =>
            isNull(exec.error) ? null : (
                log(
                    `| ${exec.name} | ${exec.location.slice(input.location.length, -3)} | ${exec.error.name} | ${exec.error.message.replaceAll(
                        new RegExp(
                            [
                                "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))",
                                "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
                            ].join("|"),
                            "g",
                        ),
                        "",
                    )} |`,
                )
            ),
        );
        log();
        log("</details>");
    };

    const location = () => process.cwd() + `/TEST_REPORT.md`;
    const init = () => writeFileSync(location(), "", { flag: "w" });
    const log = (...texts: (string | number)[]) => appendFileSync(location(), texts.join(" ") + "\n", { flag: "a" });
}
