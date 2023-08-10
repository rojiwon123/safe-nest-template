import { TypedParam, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";

import { INormal, Normal } from "@APP/app/user/normal";
import { HttpFailure } from "@APP/utils/error";
import { Result } from "@APP/utils/result";

@Controller("users/normals")
export class UsersNormalsController {
    @TypedRoute.Get()
    async get(): Promise<number[]> {
        return [1, 2, 3];
    }
    /**
     * 일반 사용자 공개 프로필 정보 요청 API
     *
     * @summary 일반 사용자 공개 프로필 정보 요청
     * @tag normals
     * @param normal_id 사용자 id
     * @return 일반 사용자 공개 정보
     */
    @TypedRoute.Get(":normalId")
    async geByNormalId(
        @TypedParam("normalId") normal_id: string,
    ): Promise<INormal.IPublicProfile> {
        const result = await Normal.Service.getPublicProfile()(normal_id);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        throw new HttpFailure(error.message, HttpStatus.NOT_FOUND);
    }
}
