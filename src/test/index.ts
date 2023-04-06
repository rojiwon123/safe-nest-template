import { Backend } from "@APP";
import { Configuration } from "@INFRA/config";
import { DynamicExecutor } from "@nestia/e2e";
import { IConnection } from "@nestia/fetcher";
import { createWriteStream } from "fs";
import path from "path";
import stripAnsi from "strip-ansi";

const logger = createWriteStream(path.join(__dirname, "./../../test_log.md"), {
  flags: "w"
});

const write = process.stdout.write.bind(process.stdout);

process.stdout.write = (str: string) => {
  logger.write(stripAnsi(str));
  return write(str);
};

process.on("exit", () => {
  logger.end();
});

console.log("# Test Report");
logger.write("\n<details open>\n<summary>detail test case</summary>\n\n");

async function run(): Promise<void> {
  const app = await Backend.start({ logger: false });

  const connection: IConnection = {
    host: `http://localhost:${Configuration.PORT}`
  };

  const report = await DynamicExecutor.validate({
    prefix: "test",
    parameters: () => [connection]
  })(__dirname + "/features");

  await Backend.end(app);

  const errors: Error[] = report.executions
    .filter((line) => line.error !== null)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map<Error>((result) => result.error!);

  logger.write("\n</details>\n");

  if (errors.length === 0) {
    console.log("\n\x1b[32mAll Tests Passed\x1b[0m");
    console.log(
      "\nTotal Test Time:\x1b[33m",
      report.time.toLocaleString(),
      "\x1b[0mms"
    );
  } else {
    console.log("\n\x1b[31mSome Tests Failed\x1b[0m");
    for (const error of errors) console.error(error);
    process.exit(-1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(-1);
});
