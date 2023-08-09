import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { AuthenticationService } from "@APP/providers/authentication";

@Controller("auth")
export class AuthController {
    /**
     * 카카오 인증 로그인 페이지 주소 요청
     *
     * @summary 카카오 인증 페이지 주소 요청
     * @tag authentication
     * @return 카카오 인증 페이지 주소
     */
    @TypedRoute.Get("oauth/kakao")
    getKakaoLoginUrl(): Promise<string> {
        return AuthenticationService.getLoginUrl("kakao");
    }

    /**
     * 깃허브 인증 로그인 페이지 주소 요청
     *
     * @summary 깃허브 인증 페이지 주소 요청
     * @tag authentication
     * @return 깃허브 인증 페이지 주소
     */
    @TypedRoute.Get("oauth/github")
    getGithubLoginUrl(): Promise<string> {
        return AuthenticationService.getLoginUrl("github");
    }
}
