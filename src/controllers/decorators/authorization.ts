import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
import { isNull, isUndefined, throwIf } from "@UTIL";
import { Request } from "express";
import { pipe } from "rxjs";

type TOKEN_TYPE = "basic" | "bearer";

const extract_authorization_header = (context: ExecutionContext) =>
  context.switchToHttp().getRequest<Request>().headers["authorization"];

const validate_token_type = (type: TOKEN_TYPE) => (input: string) =>
  input.match(new RegExp(`^${type}\\s+\\S+`, "i"));

const extract_token = (input: RegExpMatchArray) => input[0].split(/\s+/)[1];

const AuthorizationRequired = new UnauthorizedException(
  "Authorization header is required."
);

const RequestUnauthorized = new UnauthorizedException(
  "Request is unauthorized."
);

export const Authorization = (token_type: TOKEN_TYPE = "bearer") =>
  createParamDecorator((type: TOKEN_TYPE, ctx: ExecutionContext) =>
    pipe(
      extract_authorization_header,

      throwIf(isUndefined, AuthorizationRequired),

      validate_token_type(type),

      throwIf(isNull, RequestUnauthorized),

      extract_token
    )(ctx)
  )(token_type);
