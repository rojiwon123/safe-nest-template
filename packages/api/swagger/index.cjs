#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require("child_process");

console.log("start server for swagger ui...");
const child = exec(`node ${__dirname}/app.cjs`, (err, stdout) => {
    if (err) console.error(err);
    else if (stdout) console.log(stdout);
});
child.stdout.on("data", (data) => {
    console.clear();
    process.stdout.write(data);
});

child.stderr.on("data", (err) => {
    process.stderr.write(err);
});
