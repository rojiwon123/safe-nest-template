import type nestia from "@nestia/sdk";

const NESTIA_CONFIG: nestia.INestiaConfig = {
  input: "src/controllers",
  output: "src/api",
  json: true,
  primitive: false,
  swagger: {
    output: "packages/api/swagger.json",
    security: {
      bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header"
      }
    }
  }
};

export default NESTIA_CONFIG;
