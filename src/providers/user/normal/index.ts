import { Prisma } from "@PRISMA";

import { INormal } from "@APP/api/structures/user/INornal";
import { ErrorCode } from "@APP/api/types/ErrorCode";
import { InternalFailure, Result } from "@APP/utils";

import { Service } from "./service";

export const NormalService: NormalService = Service;

export interface NormalService {
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
