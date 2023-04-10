import { IAccessor } from "@DTO/user/accessor";
import { TypedBody } from "@nestia/core";
import { Controller, Post } from "@nestjs/common";
import { AccessorService } from "src/app/user";

@Controller()
export class AccessorController {
  /**
   * oauth 로그인 API
   *
   * @param body oauth code & oauth type
   * @returns 사용자 인증 정보
   */
  @Post("sign-in/oauth")
  signIn(@TypedBody() body: IAccessor.IOauthSignIn): Promise<IAccessor> {
    return AccessorService.signIn(body);
  }
}
