import { Effect, Layer } from "effect";

import { Err } from "@/common/err/err";
import { UserErr } from "@/common/err/err_code/user.code";
import { DBTx, PrismaErr, queryEffect } from "@/infrastructure/db";
import { Make } from "@/util/make";

import { User } from "./user.model";
import { IUsersUsecase, UsersUsecaseToken } from "./users.usecase.interface";

export class UsersUsecase implements IUsersUsecase {
    static readonly layer = Make.once(() => Layer.succeed(UsersUsecaseToken, new UsersUsecase()));

    profile(input: User.Id): Effect.Effect<IUsersUsecase.Profile, Err<UserErr.NotFound> | PrismaErr> {
        return Effect.gen(function* () {
            const tx = yield* DBTx();
            const user = yield* queryEffect(() => tx.users.findFirst({ where: { id: input.user_id, deleted_at: null } }));
            return user ? { id: user.id, name: user.name } : yield* Effect.fail(new Err<UserErr.NotFound>({ code: "USER_NOT_FOUND" }));
        });
    }
}
