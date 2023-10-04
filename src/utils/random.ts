import { randomInt, randomUUID } from "crypto";

export namespace Random {
    export const uuid = () => randomUUID();
    export const int = ({ min = 0, max }: { min?: number; max: number }) =>
        randomInt(min, max);
    export const decimal = (max: number) => Math.random() * max;
    export const string = (length: number) => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        return Array.from({ length }, () =>
            chars.charAt(int({ max: chars.length })),
        ).join("");
    };
}
