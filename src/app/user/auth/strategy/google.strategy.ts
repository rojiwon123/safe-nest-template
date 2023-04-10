import { Google, StrategyException } from "@devts/nestjs-auth";
import { IAccessor } from "@DTO/user/accessor";
import { Configuration } from "@INFRA/config";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import typia from "typia";
import { OAUTH_PROFILE } from "./oauth.profile.key";

export class GoogleStrategy extends Google.AbstractStrategy<
  typeof OAUTH_PROFILE,
  "email" | "profile",
  IAccessor.IOauthProfile
> {
  constructor() {
    super({
      key: "OAUTH_PROFILE",
      client_id: Configuration.GOOGLE_CLIENT_ID,
      client_secret: Configuration.GOOGLE_CLIENT_SECRET,
      redirect_uri: Configuration.GOOGLE_REDIRECT_URI,
      access_type: "offline",
      prompt: "select_account",
      scope: ["email", "profile"]
    });
  }

  protected override throw({
    message = "Fail to authenticate for Google"
  }: StrategyException): never {
    throw new UnauthorizedException(message);
  }

  override getCode(request: Request): string {
    const code = (request.body as any)?.code;
    if (typeof code !== "string") {
      throw new BadRequestException("'code' in body is invalid.");
    }
    return code;
  }

  validate(identity: Google.IdToken<"email" | "profile">): boolean {
    if (!typia.is(identity)) {
      this.throw({ message: "Insufficient user information." });
    }
    return true;
  }

  transform(
    identity: Google.IdToken<"email" | "profile">
  ): IAccessor.IOauthProfile {
    const { name, email, sub } = identity;
    return {
      name,
      email,
      sub,
      oauth_type: "google"
    };
  }
}
