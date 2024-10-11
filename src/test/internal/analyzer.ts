import { entries, groupBy, map, pipe, toArray } from "@fxts/core";
import { DynamicExecutor } from "@nestia/e2e";
import fs from "fs";
import path from "path";

export namespace TestAnalyzer {
    type IAnalyze =
        | {
              state: 0;
              total_count: number;
              total_time: number;
              elapsed_time: [string, number][];
          }
        | {
              state: -1;
              total_count: number;
              failed_count: number;
              executions: (DynamicExecutor.IExecution & {
                  error: Error;
              })[];
          };

    export const analyze = (report: DynamicExecutor.IReport): IAnalyze => {
        report.executions.forEach((exe) => {
            exe.location = exe.location
                .replace(report.location + "/", "")
                .replace(/\.(js|ts)$/, "")
                .replaceAll("/", " > ");
        });

        const executions = report.executions.filter(
            <T extends { error: Error | null }>(exe: T): exe is T & { error: Error } => exe.error !== null,
        );

        if (executions.length === 0) {
            const elapsed_time = pipe(
                report.executions,
                groupBy((exe) => exe.location),
                entries,
                map(([location, exe]): [string, number] => [
                    location,
                    exe.reduce((prev, curr) => prev + new Date(curr.completed_at).getTime() - new Date(curr.started_at).getTime(), 0),
                ]),
                toArray,
            );

            return {
                state: 0,
                total_count: report.executions.length,
                total_time: report.time,
                elapsed_time,
            };
        }

        return {
            state: -1,
            total_count: report.executions.length,
            failed_count: executions.length,
            executions,
        };
    };

    export const report = (analyzed: IAnalyze, md: boolean): void => {
        const logs: string[] = [];
        if (!md) logs.push("");
        if (analyzed.state === 0) {
            logs.push("# Test Report ✅");
            logs.push("");
            if (md) {
                logs.push("## Summary");
                logs.push("");
                logs.push("| Total | Passed | Failed | Elapsed Time |");
                logs.push("| :---: | :---: | :---: | :---: |");
                logs.push(`| ${analyzed.total_count} | ${analyzed.total_count} | 0 | ${analyzed.total_time} ms |`);
                logs.push("");
                logs.push("## Detail");
                logs.push("");
                analyzed.elapsed_time.forEach(([name, time]) => logs.push(`- ${name} : ${time} ms`));
            } else {
                logs.push(`${analyzed.total_count} Tests passed`);
                logs.push(`Total Elapsed Time ${analyzed.total_time} ms`);
            }
        } else {
            logs.push("# Test Report ❌");
            logs.push("");
            if (md) {
                logs.push("## Summary");
                logs.push("");
                logs.push("| Total | Passed | Failed |");
                logs.push("| :---: | :---: | :---: |");

                logs.push(`| ${analyzed.total_count} | ${analyzed.total_count - analyzed.failed_count} | ${analyzed.failed_count} |`);
                logs.push("");
                logs.push("## Detail");
                logs.push("");
                analyzed.executions.forEach((exe) => {
                    logs.push(`- ${exe.location} > ${exe.name}`);
                    logs.push("\n```bash");
                    logs.push(exe.error.stack ?? `${exe.error.name} ${exe.error.message}`);
                    logs.push("```");
                    logs.push("");
                });
            } else {
                logs.push(`${analyzed.failed_count} in ${analyzed.total_count} Tests Failed`);
                logs.push("");
            }
        }

        if (md) {
            fs.writeFileSync(path.resolve(process.cwd(), "./test.md"), logs.join("\n"), {
                flag: "w",
            });
        } else console.log(logs.join("\n"));
    };
}
