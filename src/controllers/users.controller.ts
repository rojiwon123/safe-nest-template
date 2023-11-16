import core from "@nestia/core";
import * as nest from "@nestjs/common";

import { UsersUsecase } from "@APP/application/users.usecase";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IUser } from "@APP/types/IUser";
import { Regex } from "@APP/types/global";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

@nest.Controller("users")
export class UsersController {
    /**
     * 사용자 정보를 불러옵니다.
     *
     * @summary 사용자 정보 보기
     * @tag users
     * @param user_id 게시글 id
     * @return 사용자 정보
     */
    @core.TypedException<ErrorCode.User.NotFound>(nest.HttpStatus.NOT_FOUND)
    @core.TypedRoute.Get(":user_id")
    async get(@core.TypedParam("user_id") user_id: Regex.UUID): Promise<IUser> {
        const result = await UsersUsecase.get(user_id);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        throw Failure.Http.fromInternal(error, nest.HttpStatus.NOT_FOUND);
    }
}
