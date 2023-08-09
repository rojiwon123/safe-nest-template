import { IConnection } from "@nestia/fetcher";

export const test_example = async (connection: IConnection) => {
    console.log(connection);
};
