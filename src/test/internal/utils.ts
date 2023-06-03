import { IConnection } from "@nestia/fetcher";

export const addHeader =
  (connection: IConnection) =>
  (HeaderName: string, value: string): IConnection => ({
    ...connection,
    headers: {
      ...connection.headers,
      [HeaderName]: value
    }
  });

export const setAuthorization =
  (connection: IConnection) =>
  (token_type: string) =>
  (value: string): IConnection => ({
    ...connection,
    headers: {
      ...connection.headers,
      Authorization: `${token_type} ${value}`
    }
  });

export const setAuthBear = (connection: IConnection) =>
  setAuthorization(connection)("bearer");
