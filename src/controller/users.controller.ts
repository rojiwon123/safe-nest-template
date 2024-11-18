import core from "@nestia/core";
import * as nest from "@nestjs/common";

import { Exception } from "@/common/exception";
import { Regex } from "@/util/type";

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
    async profile(@core.TypedParam("user_id") user_id: Regex.UUID): Promise<void> {
        user_id;
        throw Error("not impl");
    }
}
