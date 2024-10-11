export const notImpl = () => {
    throw new Error("not impl");
};

const descript = (key: string | symbol): [string | symbol, PropertyDescriptor] => [
    key,
    { writable: false, enumerable: false, configurable: false },
];

export const freezeObject = <T extends object>(obj: T): T =>
    Object.defineProperties(
        obj,
        Object.fromEntries([...Object.getOwnPropertySymbols(obj).map(descript), ...Object.getOwnPropertyNames(obj).map(descript)]),
    );
