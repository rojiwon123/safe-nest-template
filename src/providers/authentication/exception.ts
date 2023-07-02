import { UnauthorizedException } from "@nestjs/common";

export namespace Exception {
    type UnauthorizedMessage = "Authentication Fail";

    export const Unauthorized = (message: UnauthorizedMessage) =>
        new UnauthorizedException(message);
}
