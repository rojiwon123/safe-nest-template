import typia from "typia";

import api from "../../../packages/sdk";

export const test_health_check = async (connection: api.IConnection) => {
    const result = await api.functional.health.check(connection);
    typia.assert<{ status: 200; data: "hello world!" }>(result);
};
