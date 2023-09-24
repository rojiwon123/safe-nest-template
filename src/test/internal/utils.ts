import { IConnection } from "@nestia/fetcher";

import { IToken } from "@APP/types/dto/IToken";

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

declare const a: IConnection<{
    Authorization: `${"bearer" | "basic"} ${string}`;
}>;

a.headers?.Authorization;
