import { Prisma } from "@PRISMA";

import { ErrorCode } from "@APP/types/dto/ErrorCode";
import { InternalFailure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

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

export interface INormal {
    type: "normal";
    id: string;
    name: string;
    created_at: string;
    other_attr: boolean;
}

export namespace INormal {
    export type IPublicProfile = Pick<INormal, "type" | "id" | "name">;
}
