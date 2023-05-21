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
