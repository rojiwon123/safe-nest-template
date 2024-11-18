import type nestia from "@nestia/sdk";

const NESTIA_CONFIG: nestia.INestiaConfig = {
    input: "src/controller",
    output: "./sdk",
    simulate: false,
    propagate: true,
    clone: true,
    primitive: true,
    json: false,
    swagger: {
        openapi: "3.0",
        decompose: true,
        output: "packages/doc/openapi.json",
        servers: [{ url: "http://localhost:4000", description: "Local Server" }],
        security: { bearer: { type: "http", scheme: "bearer" } },
    },
};

export default NESTIA_CONFIG;
