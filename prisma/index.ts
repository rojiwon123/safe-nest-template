import { createSchema } from "schemix";

createSchema({
    basePath: __dirname,
    datasource: {
        provider: "postgresql",
        url: { env: "DATABASE_URL" },
    },
    generator: [
        {
            name: "db",
            provider: "prisma-client-js",
            output: "../db",
        },
        {
            name: "markdown",
            provider: "prisma-markdown",
            output: "../ERD.md",
            title: "template",
        },
    ],
}).export(__dirname, "schema");
