import api from "@PROJECT/api";
import typia from "typia";

import { ITarget } from "../internal/target";

export const test_example = async (connection: ITarget) => {
    const result = await api.functional.users.normals.geByNormalId(
        connection,
        "",
        {} as any,
    );
    switch (result.status) {
        case 200:
            typia.is(result.data);
        case 404:
            typia.is(result.data);
    }
    console.log();
};
