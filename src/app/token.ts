import { isNull, pipe, unless } from "@fxts/core";
import typia from "typia";

import { Configuration } from "@APP/infrastructure/config";
import { ErrorCode } from "@APP/types/dto/ErrorCode";
import { IToken } from "@APP/types/dto/IToken";
import { Crypto } from "@APP/utils/crypto";
import { DateMapper } from "@APP/utils/date";
import { Failure } from "@APP/utils/failure";
import { assertModule } from "@APP/utils/fx";
import { Result } from "@APP/utils/result";

assertModule<Token>(Token);

export interface Token {
    readonly verifyAccess: (
        token: string,
    ) => Result<
        IToken.IAccess,
        Failure.External<"Crypto.decrypt"> | Failure.Internal<ErrorCode.Token>
    >;
    readonly generateAccess: (
        input: IToken.IAccess.ICreate,
    ) => Result<IToken.IResponse<"access">, Failure.External<"Crypto.encrypt">>;

    readonly verifyRefresh: (
        token: string,
    ) => Result<
        IToken.IRefresh,
        Failure.External<"Crypto.decrypt"> | Failure.Internal<ErrorCode.Token>
    >;
    readonly generateRefresh: (
        input: IToken.IRefresh.ICreate,
    ) => Result<
        IToken.IResponse<"refresh">,
        Failure.External<"Crypto.encrypt">
    >;
}

/**
 * 인증 토큰 발급 모듈
 */
export namespace Token {
    const hour = 1000 * 60 * 60 * 1;
    const day = hour * 24;

    const durationOfAccess = hour * 8;
    const durationOfRefresh = day;

    export type verify<T extends IToken> = (
        token: string,
    ) => Result<
        T,
        Failure.External<"Crypto.decrypt"> | Failure.Internal<ErrorCode.Token>
    >;

    export type generate<T extends IToken, P> = (
        input: P,
    ) => Result<
        IToken.IResponse<T["type"]>,
        Failure.External<"Crypto.encrypt">
    >;

    const verify =
        <T extends IToken>(options: {
            key: string;
            parser: (token: string) => T | null;
        }) =>
        (token: string) =>
            pipe(
                Crypto.decrypt({ token, key: options.key }),

                unless(Result.Error.is, (ok) =>
                    pipe(
                        Result.Ok.flatten(ok),

                        options.parser,

                        (payload) =>
                            isNull(payload)
                                ? Result.Error.map(
                                      new Failure.Internal<ErrorCode.Token.Invalid>(
                                          "INVALID_TOKEN",
                                      ),
                                  )
                                : new Date() > new Date(payload.expired_at)
                                ? Result.Error.map(
                                      new Failure.Internal<ErrorCode.Token.Expired>(
                                          "EXPIRED_TOKEN",
                                      ),
                                  )
                                : Result.Ok.map(payload),
                    ),
                ),
            );

    export const generate =
        <T extends IToken, P>(options: {
            key: string;
            inputor: (input: P) => T;
            stringify: (input: T) => string;
        }) =>
        (input: P) => {
            const payload = options.inputor(input);

            return pipe(
                payload,
                options.stringify,
                (plain) => Crypto.encrypt({ plain, key: options.key }),

                unless(
                    Result.Error.is,
                    Result.Ok.lift((token) => ({
                        token,
                        expired_at: payload.expired_at,
                        token_type: payload.type as T["type"],
                    })),
                ),
            );
        };

    /// Access

    export const verifyAccess: verify<IToken.IAccess> = verify({
        key: Configuration.ACCESS_TOKEN_KEY,
        parser: typia.json.createIsParse<IToken.IAccess>(),
    });

    export const generateAccess: generate<
        IToken.IAccess,
        IToken.IAccess.ICreate
    > = generate({
        key: Configuration.ACCESS_TOKEN_KEY,
        stringify: typia.json.createStringify<IToken.IAccess>(),
        inputor: (input: IToken.IAccess.ICreate) => ({
            type: "access",
            user_id: input.user_id,
            expired_at: DateMapper.toISO(
                new Date(Date.now() + durationOfAccess),
            ),
        }),
    });

    /// Refresh

    export const verifyRefresh: verify<IToken.IRefresh> = verify({
        key: Configuration.REFRESH_TOKEN_KEY,
        parser: typia.json.createIsParse<IToken.IRefresh>(),
    });

    export const generateRefresh: generate<
        IToken.IRefresh,
        IToken.IRefresh.ICreate
    > = generate({
        key: Configuration.REFRESH_TOKEN_KEY,
        stringify: typia.json.createStringify<IToken.IRefresh>(),
        inputor: (input: IToken.IRefresh.ICreate) => ({
            type: "refresh",
            user_id: input.user_id,
            id: input.id,
            created_at: DateMapper.toISO(),
            expired_at: DateMapper.toISO(
                new Date(Date.now() + durationOfRefresh),
            ),
        }),
    });
}
