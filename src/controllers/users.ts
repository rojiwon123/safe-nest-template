import {
    TypedException,
    TypedParam,
    TypedQuery,
    TypedRoute,
} from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IAuthentication } from "@APP/app/authentication";
import { IToken } from "@APP/app/token";
import { INormal } from "@APP/app/user/normal";

@Controller("users/normals")
export class UsersNormalsController {
    @TypedRoute.Get()
    async get(@TypedQuery() query: IToken): Promise<IToken.IAccess> {
        query;
        throw Error();
    }
    /**
     * 일반 사용자 공개 프로필 정보 요청 API
     *
     * @summary 일반 사용자 공개 프로필 정보 요청
     * @tag normals
     * @param normal_id 사용자 id
     * @return 일반 사용자 공개 정보
     */
    @TypedException<IAuthentication.OuathType>(404)
    @TypedRoute.Get(":normalId")
    async geByNormalId(
        @TypedParam("normalId") normal_id: string,
        @TypedQuery() query: INormal,
    ): Promise<INormal.IPublicProfile> {
        query;
        throw Error();
    }
}
