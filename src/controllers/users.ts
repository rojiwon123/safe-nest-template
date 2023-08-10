import { TypedParam, TypedRoute } from "@nestia/core";
import { Controller, NotFoundException } from "@nestjs/common";

import { INormal, Normal } from "@APP/app/user/normal";
import { Result } from "@APP/utils/result";

@Controller("users/normals")
export class UsersNormalsController {
    /**
     * 일반 사용자 공개 프로필 정보 요청 API
     *
     * @summary 일반 사용자 공개 프로필 정보 요청
     * @tag normals
     * @param normal_id 사용자 id
     * @return 일반 사용자 공개 정보
     */
    @TypedRoute.Get(":normal_id")
    async getOne(
        @TypedParam("normal_id") normal_id: string,
    ): Promise<INormal.IPublicProfile> {
        const result = await Normal.Service.getPublicProfile()(normal_id);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        throw new NotFoundException(error.message);
    }
}
