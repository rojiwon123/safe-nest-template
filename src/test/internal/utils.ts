import { IConnection } from "@nestia/fetcher";

import { IToken } from "@APP/app/token";

export const addHeaders =
    (headers: Record<string, string>) =>
    (connection: IConnection): IConnection => ({
        ...connection,
        headers: {
            ...connection.headers,
            ...headers,
        },
    });

const addAuthorization = ({ token, type }: { type: string; token: string }) =>
    addHeaders({ Authorization: `${type} ${token}` });

export const Token = (type: IToken.Type) => (token: string) =>
    addAuthorization({ token, type });

declare const a: IConnection<{
    Authorization: `${"bearer" | "basic"} ${string}`;
}>;

a.headers?.Authorization;
