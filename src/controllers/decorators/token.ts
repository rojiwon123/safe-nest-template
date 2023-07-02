import { isNull, isUndefined, negate, pipe } from "@fxts/core";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {
    extract_authorization_header,
    extract_token,
    validate_token_type,
} from "./internal";
import { Exception } from "./exception";
import { skip, throwError } from "@APP/utils";

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
