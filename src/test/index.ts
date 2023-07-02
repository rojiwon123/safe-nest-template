import { mock } from "./mock";
import { run } from "./runner";

(async () => {
    await mock();
    await run();
})().catch((err) => {
    console.log(err);
    process.exit(-1);
});
