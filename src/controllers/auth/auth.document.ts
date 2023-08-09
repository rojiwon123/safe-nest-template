import { TypedRoute } from "@nestia/core";
import { Controller, Res } from "@nestjs/common";
import { Response } from "express";

import { Authentication } from "@APP/providers/authentication";

@Controller("auth/oauth")
export class AuthOauthController {
    @TypedRoute.Get("kakao")
    redirectToKakao(@Res() res: Response) {
        return res.redirect(Authentication.Service.getLoginUrl["kakao"]);
    }

    @TypedRoute.Get("naver")
    redirectToNaver(@Res() res: Response) {
        return res.redirect(Authentication.Service.getLoginUrl["kakao"]); // change to naver
    }
}
