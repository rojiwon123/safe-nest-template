import { IConnection } from "@nestia/fetcher";

import { Backend } from "@APP/application";
import { Configuration } from "@APP/infrastructure/config";

import { Mocker } from "./internal/mocker";
import { runTest } from "./runner";

void (async () => {
    console.time("test time");
    Mocker.init();
    // await Seed.init();
    const app = await Backend.start({ logger: false });
    const connection: IConnection = {
        host: `http://localhost:${Configuration.PORT}`,
    };

    const state = await runTest(connection);

    await app.close();
    //  const check = await Seed.size.check();
    //  await Seed.restore();
    console.timeEnd("test time");
    //  check();
    process.exit(state);
})();
