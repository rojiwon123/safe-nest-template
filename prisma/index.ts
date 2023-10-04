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
            name: "erd",
            provider: "prisma-markdown",
            output: "../ERD.md",
            title: "BBS",
        },
    ],
}).export(__dirname, "schema");
