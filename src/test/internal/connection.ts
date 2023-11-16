import { IConnection } from "@nestia/fetcher";

export namespace Connection {
    export const addHeader =
        (key: string) =>
        (value: string | string[]) =>
        (connection: IConnection): IConnection => ({
            ...connection,
            headers: {
                ...connection.headers,
                [key]: value,
            },
        });
    export const authorize = (token: string) =>
        addHeader("authorization")(`Bearer ${token}`);
}
