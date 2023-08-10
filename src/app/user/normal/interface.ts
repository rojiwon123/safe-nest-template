import { Prisma } from "@PRISMA";

import { ErrorCode } from "@APP/types/ErrorCode";
import { InternalFailure } from "@APP/utils/error";
import { Result } from "@APP/utils/result";

import { IUser } from "../interface";

export interface INormalService {
    readonly get: (
        tx?: Prisma.TransactionClient,
    ) => (normal_id: string) => Promise<Result<INormal, InternalFailure>>;

    readonly getPublicProfile: (
        tx?: Prisma.TransactionClient,
    ) => (
        normal_id: string,
    ) => Promise<
        Result<INormal.IPublicProfile, InternalFailure<ErrorCode.UserNotFound>>
    >;
}

export interface INormal extends IUser.IBase<"normal"> {}

export namespace INormal {
    export type IPublicProfile = Pick<INormal, "type" | "id" | "name">;
}
