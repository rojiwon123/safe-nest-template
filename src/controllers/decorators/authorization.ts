import { isUndefined, pipe } from "@fxts/core";
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
import { isNull, throwIf } from "@UTIL";
import { Request } from "express";

type TokenType = "basic" | "bearer";

const extract_authorization_header = (context: ExecutionContext) =>
  context.switchToHttp().getRequest<Request>().headers["authorization"];

const validate_token_type = (type: TokenType) => (input: string) =>
  input.match(new RegExp(`^${type}\\s+\\S+`, "i"));

const extract_token = (input: RegExpMatchArray) => input[0].split(/\s+/)[1];

const AuthorizationRequired = new UnauthorizedException(
  "Authorization header is required."
);

const RequestUnauthorized = new UnauthorizedException(
  "The format of the Authorization header is invalid"
);

export const Authorization = (token_type: TokenType = "bearer") =>
  createParamDecorator((type: TokenType, ctx: ExecutionContext) =>
    pipe(
      ctx,

      extract_authorization_header,

      throwIf(isUndefined, AuthorizationRequired),

      validate_token_type(type),

      throwIf(isNull, RequestUnauthorized),

      extract_token,

      throwIf(isUndefined, RequestUnauthorized)
    )
  )(token_type);
