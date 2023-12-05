import type nestia from "@nestia/sdk";

const NESTIA_CONFIG: nestia.INestiaConfig = {
    input: "src/controllers",
    output: "./sdk",
    simulate: true,
    propagate: true,
    clone: true,
    primitive: true,
    json: false,
    swagger: {
        decompose: true,
        output: "packages/api/swagger/swagger.json",
        servers: [
            { url: "https://localhost:4000", description: "Local Server" },
        ],
        security: {
            bearer: {
                type: "http",
                scheme: "bearer",
            },
        },
    },
};

export default NESTIA_CONFIG;
