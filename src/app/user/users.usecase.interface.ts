import { Context, Effect } from "effect";

import { Err } from "@/common/err";
import { UserErr } from "@/common/err/code/user.code";
import { PrismaErr } from "@/infrastructure/db";
import { Regex } from "@/util/regex";

import { User } from "./user.model";

export interface IUsersUsecase {
    profile: (input: User.Id) => Effect.Effect<IUsersUsecase.Profile, Err<UserErr.NotFound> | PrismaErr>;
}
export class UsersUsecaseToken extends Context.Tag("UsersUsecase")<UsersUsecaseToken, IUsersUsecase>() {}

export namespace IUsersUsecase {
    export interface Profile {
        id: Regex.UUID;
        name: string;
    }
}
