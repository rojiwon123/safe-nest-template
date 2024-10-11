import core from "@nestia/core";
import * as nest from "@nestjs/common";

import { UserDTO } from "@SRC/app/users/application/user.dto";
import { UserUsecase } from "@SRC/app/users/usecase";
import { Exception } from "@SRC/util/exception";
import { Regex } from "@SRC/util/type";

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
    @core.TypedException<Exception.User.NotFound>({ status: nest.HttpStatus.NOT_FOUND })
    @core.TypedRoute.Get(":user_id")
    async profile(@core.TypedParam("user_id") user_id: Regex.UUID): Promise<UserDTO.Profile> {
        return UserUsecase.getProfile({ user_id }).then((result) =>
            result.match((ok) => ok, Exception.Http.throw(nest.HttpStatus.NOT_FOUND)),
        );
    }
}
