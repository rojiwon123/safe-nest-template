import { IAuthentication } from "@DTO/authentication";
import { pipe } from "@fxts/core";
import { Oauth } from "./oauth";

export namespace Service {
  export const signIn = (input: IAuthentication.ISignIn) =>
    pipe(
      input.code,

      Oauth.kakao,

      (input) => {
        console.log(input);
      }
    );

  export const LoginUrl = { kakao: Oauth.kakao_login_url };
}
