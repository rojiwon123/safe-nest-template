import dotenv from "dotenv";
import typia from "typia";

import { Once } from "@/util/once";
import { Random } from "@/util/random";

import { LogType } from "./logger";

const once = Once.of(() => {
    switch (process.env["NODE_ENV"]) {
        case "development":
            dotenv.config({ path: ".env", override: true });
            break;
        case "test":
            dotenv.config({ path: ".env.test", override: true });
            break;
        case "production":
            break;
        default:
            throw Error("NODE_ENV should be one of (development|production|test)");
    }

    return process.env["NODE_ENV"] === "test" ?
            ({
                PORT: 4000,
                ALLOW_ORIGIN: "*",
                LOG_LEVEL: "DEBUG",
                ACCESS_TOKEN_KEY: Random.string({ min: 32 }),
                ...process.env,
            } satisfies Partial<IConfig> as IConfig)
        :   typia.assert<IConfig>({ PORT: 4000, LOG_LEVEL: "INFO", ...process.env } satisfies Partial<IConfig>);
});

export const config = <T extends keyof IConfig>(key: T): IConfig[T] => once.get()[key];

export const initConfig = () => once.init();

interface IConfig {
    NODE_ENV: "development" | "production" | "test";
    /** @default 4000 */
    PORT: number;
    DATABASE_URL: string;

    ACCESS_TOKEN_KEY: string & typia.tags.MinLength<32> & typia.tags.MaxLength<32>;
    ALLOW_ORIGIN: string;
    LOG_LEVEL: LogType;

    AWS_EXECUTION_ENV?: string;
}
