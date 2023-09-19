import express from "express";
import { readFileSync } from "fs";
import { dirname } from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

const document = JSON.parse(
  readFileSync(
    `${dirname(fileURLToPath(import.meta.url))}/swagger.json`,
    "utf8"
  )
);

const app = express();

app.use("/", swaggerUi.serve, swaggerUi.setup(document));

app.listen(6060, () => {
  console.log("✅ View Swagger UI: http://localhost:6060");
});
