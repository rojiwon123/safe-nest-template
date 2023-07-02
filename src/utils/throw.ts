export const throwError =
    <T, E extends Error>(err: (input: T) => E) =>
    (input: T) => {
        throw err(input);
    };
