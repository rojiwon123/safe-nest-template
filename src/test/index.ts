import { mock_function } from "./internal/mock";
import { run } from "./runner";

(async () => {
    mock_function();
    await run();
})().catch((err) => {
    console.log(err);
    process.exit(-1);
});
