"use strict";

const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root_package = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));

const version = "version";
const dep = "dependencies";

const lib_path = path.resolve(process.cwd(), "packages/sdk/package.json");

const lib_package = JSON.parse(fs.readFileSync(lib_path, "utf-8"));

lib_package[version] = root_package[version];
lib_package[dep] = lib_package[dep] ?? {};
lib_package[dep]["typia"] = root_package[dep]["typia"];
lib_package[dep]["@nestia/fetcher"] = root_package[dep]["@nestia/core"];

fs.writeFileSync(lib_path, JSON.stringify(lib_package, null, 2), "utf-8");

cp.execSync("git add ./packages/sdk/package.json");
