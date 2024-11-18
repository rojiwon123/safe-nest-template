import sdk from "@project/sdk";

export const test_health_check = async (connection: sdk.IConnection) => {
    const res = await sdk.functional.health.check(connection);
    if (res.status === 200 && res.data === "hello world!") return;
    throw new Error("health check failed");
};
