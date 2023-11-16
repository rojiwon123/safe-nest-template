/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const fs = require("fs");
const ui = require("swagger-ui-express");

const document = JSON.parse(
    fs.readFileSync(`${__dirname}/swagger.json`, "utf8"),
);

express()
    .use("/", ui.serve, ui.setup(document))
    .listen(6060, () => {
        console.log("✅ View Swagger UI: http://localhost:6060");
    });
