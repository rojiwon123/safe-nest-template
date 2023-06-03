import { ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const extract_authorization_header = (context: ExecutionContext) =>
  context.switchToHttp().getRequest<Request>().headers["authorization"];

export const validate_token_type =
  (type: "bearer" | "basic") => (input: string) =>
    input.match(new RegExp(`^${type}\\s+\\S+`, "i"));

export const extract_token = (input: RegExpMatchArray) =>
  input[0].split(/\s+/)[1];
