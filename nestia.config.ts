import type nestia from "@nestia/sdk";

const NESTIA_CONFIG: nestia.INestiaConfig = {
  input: "src/controller",
  output: "src/api",
  json: true,
  primitive: false,
  swagger: {
    output: "swagger.json",
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
