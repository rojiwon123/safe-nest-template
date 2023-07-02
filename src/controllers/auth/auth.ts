import { IAuthentication } from "@APP/api/structures/authentication";
import { Authentication } from "@APP/providers/authentication";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

@Controller("auth/sign-in/kakao")
export class SignInKakaoController {
    @TypedRoute.Post()
    execute(@TypedBody() body: IAuthentication.ISignIn): Promise<void> {
        return Authentication.Service.signIn(body);
    }
}
