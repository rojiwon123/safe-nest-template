import { UnauthorizedException } from "@nestjs/common";

export namespace Exception {
  export const AuthorizationRequired = new UnauthorizedException(
    "Authorization Header Required"
  );

  export const AuthorizationInvalid = new UnauthorizedException(
    "Value of Authorization Header Invalid"
  );
}
