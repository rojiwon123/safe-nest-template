import { isNull, isUndefined, negate, pipe } from "@fxts/core";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { skip, throwError } from "@APP/utils";

import { Exception } from "./exception";
import {
    extract_authorization_header,
    extract_token,
    validate_token_type,
} from "./internal";

export const Token = (token_type: "basic" | "bearer" = "bearer") =>
    createParamDecorator((type: "basic" | "bearer", ctx: ExecutionContext) =>
        pipe(
            ctx,

            extract_authorization_header,

            skip(
                negate(isUndefined),
                throwError(() =>
                    Exception.Unauthorized("Authorization Header Required"),
                ),
            ),

            validate_token_type(type),

            skip(
                negate(isNull),
                throwError(() =>
                    Exception.Unauthorized(
                        "Value of Authorization Header Invalid",
                    ),
                ),
            ),

            extract_token,

            skip(
                negate(isUndefined),
                throwError(() =>
                    Exception.Unauthorized(
                        "Value of Authorization Header Invalid",
                    ),
                ),
            ),
        ),
    )(token_type);
