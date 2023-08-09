import { pipe, throwIf } from "@fxts/core";
import typia from "typia";

import { IUser } from "@APP/api/structures/user/user";

import { BIZUser } from "./biz_user";

export namespace Service {
    export const getFalse = (): false => !BIZUser.Service.getTrue();
    export const flip = (get: () => boolean) => () => !get();

    /**
     * @throw Not Found
     */
    export const getOne = async (user_id: string): Promise<IUser> =>
        pipe(
            user_id,

            (id) => ({ ...typia.random<IUser>(), id }),

            throwIf((user) => user.id === "not found user id"),

            (user) => ({ ...user, tash: "test" }),
        );
}
