import { UnauthorizedException } from "@nestjs/common";

export namespace Exception {
  export const AuthenticationFail = new UnauthorizedException(
    "Authentication Fail"
  );
}
