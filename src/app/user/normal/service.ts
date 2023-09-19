import typia from "typia";

import { prisma } from "@APP/infrastructure/DB";
import { typedModule } from "@APP/utils/fx";
import { Result } from "@APP/utils/result";

import { INormal, INormalService } from "./interface";

typedModule<INormalService>(NormalService);

export namespace NormalService {
    export const get: INormalService["get"] =
        (tx = prisma) =>
        async (normal_id) => {
            tx;
            normal_id;
            return Result.Ok.map(typia.random<INormal>());
        };

    export const getPublicProfile: INormalService["getPublicProfile"] =
        (tx = prisma) =>
        async (normal_id) => {
            normal_id;
            tx;
            throw Error();
        };

    /**
    export const getPrivateProfile = () => {};
    export const getSummaryList = () => {};
    */
}
