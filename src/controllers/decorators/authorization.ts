import { isUndefined, negate, pipe, unless } from "@fxts/core";
import {
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from "@nestjs/common";
import { Request } from "express";

import { IToken } from "@APP/api/structures/IToken";
import { ErrorCode } from "@APP/api/types/ErrorCode";

const extract_authorization_header = (ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request>().headers["authorization"];

const extract_token = (token_type: string) => (header: string) =>
    header
        .match(new RegExp(`^${token_type}\\s+\\S+`, "i"))
        ?.at(0)
        ?.split(/\s+/)[1];

const Unauthorized = (message: ErrorCode.Authorization) => () => {
    throw new UnauthorizedException(message);
};

export const Authorization = (token_type: IToken.Type) =>
    createParamDecorator((type: string, ctx: ExecutionContext) =>
        pipe(
            ctx,

            extract_authorization_header,

            unless(negate(isUndefined), Unauthorized("UNAUTHORIZED_REQUEST")),

            extract_token(type),

            unless(negate(isUndefined), Unauthorized("INVALID_HEADER_VALUE")),
        ),
    )(token_type);
