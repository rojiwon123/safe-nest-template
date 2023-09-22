import api from "@PROJECT/api";
import { IConnection } from "@nestia/fetcher";

export const test_example = async (connection: IConnection) => {
    const result = await api.functional.users.normals.geByNormalId(
        connection,
        "",
        {} as any,
    );
    if (result.status === 200) {
        result.data.name;
    }
};
