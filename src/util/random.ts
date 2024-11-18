import { randomBytes, randomInt, randomUUID } from "crypto";
import typia from "typia";

export namespace Random {
    export const uuid = (): string => randomUUID();
    /** `min <= n < max` */
    export const int = ({ min = 0, max = min + 1 }: { min?: number; max?: number }): number => randomInt(min, max);
    /** `0 <= n < max` */
    export const double = (input: { min?: number; max?: number }): number => Math.random() + int(input);
    export const string = (input: { min?: number; max?: number }) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const length = int(input);
        return Array.from({ length }, () => chars.charAt(int({ max: chars.length }))).join("");
    };
    export const base64 = (byteLength: number) => randomBytes(byteLength).toString("base64url");
    export const datetime = typia.createRandom<string & typia.tags.Format<"date-time">>();
}
