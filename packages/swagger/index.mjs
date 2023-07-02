#!/usr/bin/env node

import { exec } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";

console.log("start server for swagger ui...");
export const child = exec(
  `node ${dirname(fileURLToPath(import.meta.url))}/app.mjs`,
  (err, stdout) => {
    if (err) console.error(err);
    else if (stdout) console.log(stdout);
    return;
  }
);
child.stdout.on("data", (data) => {
  console.clear();
  process.stdout.write(data);
});

child.stderr.on("data", (err) => {
  process.stderr.write(err);
});
