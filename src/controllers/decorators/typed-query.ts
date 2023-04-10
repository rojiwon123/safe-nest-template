import {
  assignMetadata,
  BadRequestException,
  ExecutionContext,
  HttpException
} from "@nestjs/common";
import {
  CUSTOM_ROUTE_ARGS_METADATA,
  ROUTE_ARGS_METADATA
} from "@nestjs/common/constants";
import { isString, isStringArray, isUndefined } from "@UTIL";
import { Request } from "express";

interface QueryTypeOptions {
  type?: "string" | "boolean" | "number";
  /**
   * if array is true, query value casted to array type
   */
  array?: boolean;
  /**
   * if optional is false, query value required
   *
   * default is false
   */
  optional?: boolean;
}

const cast = (err: HttpException) => ({
  boolean(value: string): boolean {
    switch (value.toLowerCase()) {
      case "true":
      case "1":
        return true;
      case "false":
      case "0":
        return false;
      default:
        throw err;
    }
  },
  number(value: string): number {
    const num = Number(value);
    if (isNaN(num) || value === "") throw err;
    return num;
  },
  string(value: string): string {
    return value;
  }
});

const query_type_cast = (
  key: string,
  ctx: ExecutionContext,
  options?: QueryTypeOptions
) => {
  const { type = "string", array = false, optional = false } = options ?? {};
  const value = ctx.switchToHttp().getRequest<Request>().query[key];
  const exception = new BadRequestException(
    `Value of the URL query '${key}' is invalid.`
  );

  const type_cast: (input: string) => boolean | number | string =
    cast(exception)[type];

  if (isUndefined(value) || value === "") {
    if (!optional) throw exception;
    return array ? [] : value;
  }

  if (isString(value)) {
    const casted = type_cast(value);
    return array ? [casted] : casted;
  }

  if (isStringArray(value) && array) {
    return value.map(type_cast);
  }

  throw exception;
};

/**
 * 타입 변환된 쿼리 값을 전달한다.
 *
 * @param key query key
 * @param options
 *
 * type-cast options
 *
 * - type : Casting target type, default is string
 * - array : Whether to cast it into an array form or not, default is false
 * - optional : Whether to allow undefined or not, default is false
 */
export const TypedQuery =
  (key: string, options?: QueryTypeOptions): ParameterDecorator =>
  (target, propertyKey, index) => {
    const args =
      Reflect.getMetadata(
        ROUTE_ARGS_METADATA,
        target.constructor,
        propertyKey
      ) || {};

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      {
        ...assignMetadata(args, 4, index, key), // 4 is QUERY
        [`query${CUSTOM_ROUTE_ARGS_METADATA}:${index}`]: {
          index,
          factory: (_: unknown, ctx: ExecutionContext) =>
            query_type_cast(key, ctx, options)
        }
      },
      target.constructor,
      propertyKey
    );
  };
