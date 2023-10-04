import { isUndefined, negate, pipe, unless } from "@fxts/core";
import {
    ExecutionContext,
    HttpStatus,
    createParamDecorator,
} from "@nestjs/common";
import { Request } from "express";

import { ErrorCode } from "@APP/types/ErrorCode";
import { IToken } from "@APP/types/IToken";
import { Failure } from "@APP/utils/failure";

const extract_authorization_header = (ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request>().headers["authorization"];

const extract_token = (token_type: string) => (header: string) =>
    header
        .match(new RegExp(`^${token_type}\\s+\\S+`, "i"))
        ?.at(0)
        ?.split(/\s+/)[1];

const Unauthorized = (message: ErrorCode.Authorization) => () => {
    throw new Failure.Http(message, HttpStatus.UNAUTHORIZED);
};

export const Authorization = (token_type: IToken.Type) =>
    createParamDecorator((type: string, ctx: ExecutionContext) =>
        pipe(
            ctx,

            extract_authorization_header,

            unless(negate(isUndefined), Unauthorized("UNAUTHORIZED_REQUEST")),

            extract_token(type),

            unless(negate(isUndefined), Unauthorized("UNAUTHORIZED_REQUEST")),
        ),
    )(token_type);
