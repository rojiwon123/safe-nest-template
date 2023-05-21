import { IAuthentication } from "@DTO/authentication";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { Authentication } from "@PROVIDER/authentication";

@Controller("auth/sign-in/kakao")
export class SignInKakaoController {
  @TypedRoute.Post()
  execute(@TypedBody() body: IAuthentication.ISignIn): Promise<void> {
    return Authentication.Service.signIn(body);
  }
}
