import { IConnection } from "@nestia/fetcher";

export const addHeaders =
    (headers: Record<string, string>) =>
    (connection: IConnection): IConnection => ({
        ...connection,
        headers: {
            ...connection.headers,
            ...headers,
        },
    });

export const addAuthorization = ({
    token,
    type,
}: {
    type: string;
    token: string;
}) => addHeaders({ Authorization: `${type} ${token}` });

export const addBearerToken = (token: string) =>
    addAuthorization({ token, type: "Bearer" });
