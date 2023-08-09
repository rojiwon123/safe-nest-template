import { pipe, unless } from "@fxts/core";
import typia from "typia";

import { IToken } from "@APP/api/structures/IToken";
import { ErrorCode } from "@APP/api/types/ErrorCode";
import { Configuration } from "@APP/infrastructure/config";
import {
    Crypto,
    DateMapper,
    ExternalFailure,
    InternalFailure,
    Result,
} from "@APP/utils";

import { Token } from "./index";

const hour = 1000 * 60 * 60 * 1;
const day = hour * 24;

const _verify = <T extends Token>({
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
                return Result.Error.map(new InternalFailure("INVALID_TOKEN"));
            }
        }),
    );

export namespace AccountService {
    const duration = hour;
    const key = Configuration.ACCOUNT_TOKEN_KEY;

    export const generate = ({
        account_id,
    }: Token.ICreate<Token.Account>): Result<
        IToken,
        ExternalFailure<"Crypto.encrypt">
    > => {
        const expired_at = DateMapper.toISO(new Date(Date.now() + duration));
        return pipe(
            {
                type: "account",
                account_id,
                expired_at,
            } satisfies Token.Account,
            typia.createStringify<Token.Account>(),
            (plain) => Crypto.encrypt({ plain, key }),
            unless(
                Result.Error.is,
                Result.Ok.lift((token) => ({ token, expired_at })),
            ),
        );
    };

    export const verify = (token: string) =>
        _verify({
            token,
            parser: typia.createAssertParse<Token.Account>(),
            key,
        });
}

export namespace AccessService {
    const duration = hour * 8;
    const key = Configuration.ACCESS_TOKEN_KEY;

    export const generate = ({
        user_id,
        user_type,
    }: Token.ICreate<Token.Access>): Result<
        IToken,
        ExternalFailure<"Crypto.encrypt">
    > => {
        const expired_at = DateMapper.toISO(new Date(Date.now() + duration));
        return pipe(
            {
                type: "access",
                user_id,
                user_type,
                expired_at,
            } satisfies Token.Access,
            typia.createStringify<Token.Access>(),
            (plain) => Crypto.encrypt({ plain, key }),
            unless(
                Result.Error.is,
                Result.Ok.lift((token) => ({ token, expired_at })),
            ),
        );
    };

    export const verify = (token: string) =>
        _verify({
            token,
            parser: typia.createAssertParse<Token.Access>(),
            key,
        });
}

export namespace RefreshService {
    const duration = day;
    const key = Configuration.REFRESH_TOKEN_KEY;

    export const generate = ({
        user_id,
        user_type,
    }: Token.ICreate<Token.Refresh>): Result<
        IToken,
        ExternalFailure<"Crypto.encrypt">
    > => {
        const expired_at = DateMapper.toISO(new Date(Date.now() + duration));
        return pipe(
            {
                type: "refresh",
                user_id,
                user_type,
                expired_at,
            } satisfies Token.Refresh,
            typia.createStringify<Token.Refresh>(),
            (plain) => Crypto.encrypt({ plain, key }),
            unless(
                Result.Error.is,
                Result.Ok.lift((token) => ({ token, expired_at })),
            ),
        );
    };

    export const verify = (token: string) =>
        _verify({
            token,
            parser: typia.createAssertParse<Token.Refresh>(),
            key,
        });
}
