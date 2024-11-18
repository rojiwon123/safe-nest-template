export const notImpl = (): never => {
    throw new Error("not impl");
};

const descript = (key: string | symbol) => [key, { writable: false, enumerable: false, configurable: false }] as const;
export const freeze = <T extends object>(input: T): T =>
    Object.defineProperties(
        input,
        Object.fromEntries([...Object.getOwnPropertySymbols(input).map(descript), ...Object.getOwnPropertyNames(input).map(descript)]),
    );
