import typia from "typia";
import { Exception } from "./exception";
import { IUser } from "@APP/api/structures/user/user";
import { Mutable } from "@APP/api/types";
import { pipe, throwIf } from "@fxts/core";
import { throwError } from "@APP/utils";
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

            (id) => ({ ...typia.random<Mutable<IUser>>(), id }),

            throwIf(
                (user) => user.id === "not found user id",
                throwError(() => Exception.NotFound("User Not Found")),
            ),

            (user) => ({ ...user, tash: "test" }),
        );
}
