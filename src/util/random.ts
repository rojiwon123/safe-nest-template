import { randomInt, randomUUID } from "crypto";

import { Regex } from "./type";

export namespace Random {
    export const uuid = (): Regex.UUID => randomUUID();
    /** `min <= n < max` */
    export const int = ({ min = 0, max = min + 1 }: { min?: number; max?: number }): number => randomInt(min, max);
    /** `min <= n < max` */
    export const double = ({ min = 0, max = min + 1 }: { min?: number; max?: number }): number => min + Math.random() * (max - min);
    /** `min <= string.length < max` */
    export const string = (input: { min?: number; max?: number }): string => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const length = int(input);
        return Array.from({ length }, () => chars.charAt(int({ max: chars.length }))).join("");
    };
}
