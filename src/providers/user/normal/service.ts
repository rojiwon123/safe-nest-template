import typia from "typia";

import { INormal } from "@APP/api/structures/user/INornal";
import { prisma } from "@APP/infrastructure/DB";
import { Result } from "@APP/utils";

import { NormalService } from "./index";

export namespace Service {
    export const get: NormalService["get"] =
        (tx = prisma) =>
        async (normal_id) => {
            tx;
            normal_id;
            return Result.Ok.map(typia.random<INormal>());
        };

    export const getPublicProfile: NormalService["getPublicProfile"] =
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
