import { pipe, unless } from "@fxts/core";
import typia from "typia";

import { Configuration } from "@APP/infrastructure/config";
import { ErrorCode } from "@APP/types/ErrorCode";
import { Crypto } from "@APP/utils/crypto";
import { DateMapper } from "@APP/utils/date";
import { ExternalFailure, InternalFailure } from "@APP/utils/error";
import { typedModule } from "@APP/utils/fx";
import { Result } from "@APP/utils/result";

import { IToken, ITokenService } from "./interface";

typedModule<ITokenService<IToken.IAccess>>(Token.AccessService);
typedModule<ITokenService<IToken.IAccount>>(Token.AccountService);
typedModule<ITokenService<IToken.IRefresh>>(Token.RefreshService);

export namespace Token {
    const hour = 1000 * 60 * 60 * 1;
    const day = hour * 24;

    const _verify = <T extends IToken.IBase>({
        token,
        key,
        parser,
    }: {
        token: string;
        key: string;
        parser: (input: string) => T;
    }): Result<
        T,
        ExternalFailure<"Crypto.decrypt"> | InternalFailure<ErrorCode.Token>
    > =>
        pipe(
            Crypto.decrypt({ token, key }),

            unless(Result.Error.is, (input) => {
                try {
                    const payload = parser(Result.Ok.flatten(input));
                    const expired_at = new Date(payload.expired_at);
                    const now = new Date();
                    if (now > expired_at)
                        return Result.Error.map(
                            new InternalFailure("EXPIRED_TOKEN"),
                        );
                    return Result.Ok.map(payload);
                } catch {
                    return Result.Error.map(
                        new InternalFailure("INVALID_TOKEN"),
                    );
                }
            }),
        );

    export namespace AccountService {
        const duration = hour;
        const key = Configuration.ACCOUNT_TOKEN_KEY;

        export const generate: ITokenService<IToken.IAccount>["generate"] = ({
            account_id,
        }) => {
            const expired_at = DateMapper.toISO(
                new Date(Date.now() + duration),
            );
            return pipe(
                {
                    type: "account",
                    account_id,
                    expired_at,
                } satisfies IToken.IAccount,
                typia.json.createStringify<IToken.IAccount>(),
                (plain) => Crypto.encrypt({ plain, key }),
                unless(
                    Result.Error.is,
                    Result.Ok.lift((token) => ({ token, expired_at })),
                ),
            );
        };

        export const verify: ITokenService<IToken.IAccount>["verify"] = (
            token,
        ) =>
            _verify({
                token,
                parser: typia.json.createAssertParse<IToken.IAccount>(),
                key,
            });
    }

    export namespace AccessService {
        const duration = hour * 8;
        const key = Configuration.ACCESS_TOKEN_KEY;

        export const generate: ITokenService<IToken.IAccess>["generate"] = ({
            user_id,
            user_type,
        }) => {
            const expired_at = DateMapper.toISO(
                new Date(Date.now() + duration),
            );
            return pipe(
                {
                    type: "access",
                    user_id,
                    user_type,
                    expired_at,
                } satisfies IToken.IAccess,
                typia.json.createStringify<IToken.IAccess>(),
                (plain) => Crypto.encrypt({ plain, key }),
                unless(
                    Result.Error.is,
                    Result.Ok.lift((token) => ({ token, expired_at })),
                ),
            );
        };

        export const verify: ITokenService<IToken.IAccess>["verify"] = (
            token,
        ) =>
            _verify({
                token,
                parser: typia.json.createAssertParse<IToken.IAccess>(),
                key,
            });
    }

    export namespace RefreshService {
        const duration = day;
        const key = Configuration.REFRESH_TOKEN_KEY;

        export const generate: ITokenService<IToken.IRefresh>["generate"] = ({
            user_id,
            user_type,
        }) => {
            const expired_at = DateMapper.toISO(
                new Date(Date.now() + duration),
            );
            return pipe(
                {
                    type: "refresh",
                    user_id,
                    user_type,
                    expired_at,
                } satisfies IToken.IRefresh,
                typia.json.createStringify<IToken.IRefresh>(),
                (plain) => Crypto.encrypt({ plain, key }),
                unless(
                    Result.Error.is,
                    Result.Ok.lift((token) => ({ token, expired_at })),
                ),
            );
        };

        export const verify: ITokenService<IToken.IRefresh>["verify"] = (
            token,
        ) =>
            _verify({
                token,
                parser: typia.json.createAssertParse<IToken.IRefresh>(),
                key,
            });
    }
}
