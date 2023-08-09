import type nestia from "@nestia/sdk";

const NESTIA_CONFIG: nestia.INestiaConfig = {
    input: "src/controllers",
    output: "src/api",
    json: false,
    primitive: false,
    simulate: true,
    swagger: {
        decompose: true,
        output: "packages/swagger/swagger.json",
        info: {
            version: "0.0.1",
            title: "Server Title",
            description: "Service Description",
        },
        servers: [
            { url: "https://localhost:4000", description: "Local Server" },
        ],
        security: {
            account: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
            },
            access: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
            },
            refresh: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
            },
        },
    },
};

export default NESTIA_CONFIG;
