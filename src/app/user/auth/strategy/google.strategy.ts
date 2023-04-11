import { Google, StrategyException } from "@devts/nestjs-auth";
import { IAccessor } from "@DTO/user/accessor";
import { Configuration } from "@INFRA/config";
import { UnauthorizedException } from "@nestjs/common";
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

  validate(identity: Google.IdToken<"email" | "profile">): boolean {
    if (!typia.is(identity)) {
      this.throw({ message: "Insufficient user information." });
    }
    return true;
  }

  transform(
    identity: Google.IdToken<"email" | "profile">
  ): IAccessor.IOauthProfile {
    const { sub, name, email, email_verified } = identity;
    if (!email_verified) {
      this.throw({ message: "google email is not verified." });
    }
    return {
      sub,
      name,
      email,
      oauth_type: "google"
    };
  }
}
