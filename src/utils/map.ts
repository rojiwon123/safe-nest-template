export const pick =
    <T extends object, K extends keyof T>(key: K) =>
    (obj: T) =>
        obj[key];

export const toFixed =
    (digit = 0) =>
    (num: number): number =>
        +num.toFixed(digit);
