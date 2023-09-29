import { IConnection, IPropagation } from "@nestia/fetcher";
import fs from "fs";
import stripAnsi from "strip-ansi";

import { IToken } from "@APP/types/dto/IToken";

export namespace Util {
    export namespace md {
        export const header =
            (level: 1 | 2 | 3 | 4 | 5 | 6 = 1) =>
            (title: string) =>
                console.log("#".repeat(level), title);

        let toggleOpend: boolean = false;
        export const ToggleStart = (title: string) => {
            if (toggleOpend) {
                console.log("\n</details>");
                console.log("\n<details>");
                console.log(`<summary>${title}</summary>\n`);
                toggleOpend = true;
            } else {
                console.log("\n<details>");
                console.log(`<summary>${title}</summary>\n`);
                toggleOpend = true;
            }
        };

        export const ToggleEnd = () => {
            if (toggleOpend) console.log("\n</details>");
            toggleOpend = false;
        };

        export const bash = (text: string) => {
            console.log(`\`\`\`bash\n${text}\n\`\`\``);
        };
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
                queue.forEach((str) => {
                    if (!str.endsWith("\n")) str.concat("\n");
                    stream.write(stripAnsi(str));
                    if (str.includes("</details>")) return;
                    else if (str.includes("<details>"))
                        process.stdout.write("\n");
                    else
                        process.stdout.write(
                            str
                                .replace("<summary>", "")
                                .replace("</summary>", "")
                                .replace("```bash\n", "")
                                .replace("\n```", ""),
                        );
                });
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
        (
            response: IPropagation.IBranch<
                boolean,
                IPropagation.Status,
                unknown
            >,
        ) => {
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
