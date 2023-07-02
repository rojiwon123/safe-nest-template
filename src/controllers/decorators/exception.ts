import { UnauthorizedException } from "@nestjs/common";

export namespace Exception {
    type UnauthorizedMessage =
        | "Authorization Header Required"
        | "Value of Authorization Header Invalid";

    export const Unauthorized = (message: UnauthorizedMessage) =>
        new UnauthorizedException(message);
}
