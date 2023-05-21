import { TypedRoute } from "@nestia/core";
import { Controller, Res } from "@nestjs/common";
import { Authentication } from "@PROVIDER/authentication";
import { Response } from "express";

@Controller("auth/oauth")
export class AuthOauthController {
  @TypedRoute.Get("kakao")
  redirectToKakao(@Res() res: Response) {
    return res.redirect(Authentication.Service.LoginUrl.kakao);
  }

  @TypedRoute.Get("naver")
  redirectToNaver(@Res() res: Response) {
    return res.redirect(Authentication.Service.LoginUrl.kakao);
  }
}
