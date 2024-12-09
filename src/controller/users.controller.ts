import core from "@nestia/core";
import * as nest from "@nestjs/common";
import { Effect, pipe } from "effect";
import { Request } from "express";

import { UserProfileDTO } from "@/app/user/user.dto";
import { UsersUsecaseToken } from "@/app/user/users.usecase.interface";
import { UserErr } from "@/common/err/err_code/user.code";
import { EffectHandler } from "@/effect.handler";
import { Regex } from "@/util/type";

@nest.Controller("users")
export class UsersController {
    /**
     * 사용자 정보를 불러옵니다.
     *
     * @summary 사용자 정보 보기
     * @tag User
     * @param user_id user id
     * @return 사용자 정보
     */
    @core.TypedException<UserErr.NotFound>({ status: nest.HttpStatus.NOT_FOUND })
    @core.TypedRoute.Get(":user_id")
    async profile(@nest.Request() req: Request, @core.TypedParam("user_id") user_id: Regex.UUID): Promise<UserProfileDTO> {
        const exit = await EffectHandler.runtime().runPromiseExit(
            pipe(
                Effect.flatMap(UsersUsecaseToken, (usecase) => usecase.profile({ user_id })),
                EffectHandler.trace(req),
            ),
        );
        return EffectHandler.respond(exit, { USER_NOT_FOUND: nest.HttpStatus.NOT_FOUND });
    }
}
