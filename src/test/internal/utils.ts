import { IConnection, IPropagation } from "@nestia/fetcher";
import fs from "fs";
import stripAnsi from "strip-ansi";

import { IToken } from "@APP/types/IToken";

export namespace Util {
    export namespace md {
        export const header =
            (level: 1 | 2 | 3 | 4 | 5 | 6 = 1) =>
            (title: string) =>
                console.log("#".repeat(level), title);

        let toggleOpend: boolean = false;
        export const toggleOpen = (summary: string) => {
            if (toggleOpend) {
                console.log("</details>");
                console.log("<details>");
                console.log(`<summary>${summary}</summary>`);
            } else {
                console.log("<details>");
                console.log(`<summary>${summary}</summary>`);
            }
            toggleOpend = true;
        };

        export const toggleClose = () => {
            if (toggleOpend) console.log("</details>");
            toggleOpend = false;
        };

        export const bash = (text: string) => {
            console.log("```bash\n" + text + "\n```");
        };

        export const title = (filename: string) =>
            toggleOpen(
                `\x1b[33m${filename.split("/").at(-1)!.slice(0, -3)}\x1b[0m`,
            );
    }

    export const log =
        (run: () => Promise<boolean>) =>
        async (dirname: string): Promise<boolean> => {
            const queue: string[] = [];
            const write = process.stdout.write;
            process.stdout.write = (str: string) => {
                queue.push(str);
                return true;
            };
            try {
                return await run();
            } catch (err) {
                console.log(err);
                return false;
            } finally {
                process.stdout.write = write;
                const stream = fs.createWriteStream(dirname, { flags: "w" });
                const md = queue
                    .map((line) => line.trimStart())
                    .map((line) =>
                        line.includes("</summary>") || line.startsWith("#")
                            ? line + "\n"
                            : line.includes("```bash") ||
                              line.includes("Test Count") ||
                              line.includes("❌")
                            ? "\n" + line + "\n"
                            : line.includes("</details>") || line.includes("✅")
                            ? "\n" + line
                            : line.startsWith("-")
                            ? "  " + line
                            : line,
                    )
                    .join("")
                    .replaceAll("\n\n\n", "\n\n")
                    .replaceAll(
                        "</details>\n\n<details>",
                        "</details>\n<details>",
                    );

                stream.write(stripAnsi(md));
                process.stdout.write(
                    md
                        .replaceAll("<details>\n", "")
                        .replaceAll("</details>\n", "")
                        .replaceAll("<summary>", "")
                        .replaceAll("</summary>", "")
                        .replaceAll("```bash\n", "")
                        .replaceAll("```\n", "")
                        .replaceAll("\n\n\n", "\n\n"),
                );
                stream.end();
            }
        };

    export const addHeaders =
        (headers: Record<string, string>) =>
        (connection: IConnection): IConnection => ({
            ...connection,
            headers: {
                ...connection.headers,
                ...headers,
            },
        });

    export const addToken = (type: IToken.Type) => (token: string) =>
        addHeaders({ Authorization: `${type} ${token}` });

    export const assertResposne =
        <T, H extends Record<string, string | string[]>>(options: {
            status: IPropagation.Status;
            success: boolean;
            assertBody: (body: unknown) => T;
            assertHeader?: (header: unknown) => H;
        }) =>
        (response: IPropagation.IBranch<boolean, unknown, any>) => {
            if (
                options.success !== response.success ||
                options.status !== response.status
            ) {
                const error = new Error(
                    `The API response does not match the expected result\nExpected: status: ${options.status} success: ${options.success}\nActual: status: ${response.status} success: ${response.success}`,
                );

                error.name = "AssertResponse";
                throw error;
            }

            options.assertBody(response.data);
            if (options.assertHeader) options.assertHeader(response.headers);
        };
}
