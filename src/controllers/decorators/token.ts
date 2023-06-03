import { isNull, throwIf } from "@UTIL";
import { isUndefined, pipe } from "@fxts/core";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {
  extract_authorization_header,
  extract_token,
  validate_token_type
} from "./internal";
import { Exception } from "./exception";

export const Token = (token_type: "basic" | "bearer" = "bearer") =>
  createParamDecorator((type: "basic" | "bearer", ctx: ExecutionContext) =>
    pipe(
      ctx,

      extract_authorization_header,

      throwIf(isUndefined, Exception.AuthorizationRequired),

      validate_token_type(type),

      throwIf(isNull, Exception.AuthorizationInvalid),

      extract_token,

      throwIf(isUndefined, Exception.AuthorizationInvalid)
    )
  )(token_type);
