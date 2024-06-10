import core from '@nestia/core';
import * as nest from '@nestjs/common';

import { IUser } from '@SRC/app/users/dto';
import { UsersUsecase } from '@SRC/app/users/usecase';
import { Exception } from '@SRC/common/exception';
import { Regex } from '@SRC/common/type';

@nest.Controller('users')
export class UsersController {
    /**
     * 사용자 정보를 불러옵니다.
     *
     * @summary 사용자 정보 보기
     * @tag users
     * @param user_id 게시글 id
     * @return 사용자 정보
     */
    @core.TypedException<Exception.User.NotFound>(nest.HttpStatus.NOT_FOUND)
    @core.TypedRoute.Get(':user_id')
    async get(@core.TypedParam('user_id') user_id: Regex.UUID): Promise<IUser> {
        return UsersUsecase.get(user_id).then((result) =>
            result.match(
                (ok) => ok,
                (err) => Exception.Http.throw(err, nest.HttpStatus.NOT_FOUND),
            ),
        );
    }
}
