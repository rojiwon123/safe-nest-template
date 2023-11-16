import { isNull } from "@fxts/core";
import typia from "typia";

import { Configuration } from "@APP/infrastructure/config";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IToken } from "@APP/types/IToken";
import { Regex } from "@APP/types/global";
import { Crypto } from "@APP/utils/crypto";
import { DateMapper } from "@APP/utils/date";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace Token {
    const hour = 1000 * 60 * 60 * 1;
    const day = hour * 24;

    const duration = day * 7;

    const _generate =
        <
            Payload extends { expired_at: Regex.DateTime },
            ICreate extends Payload,
        >(injection: {
            mapper: (input: ICreate) => Payload;
            stringify: (input: Payload) => string;
            encrypt: (plain: string) => Result.Ok<string>;
        }) =>
        (input: ICreate): Result.Ok<IToken.IOutput> => {
            const payload = injection.mapper(input);
            const expired_at = payload.expired_at;
            const plain = injection.stringify(payload);
            const encrypted = injection.encrypt(plain);
            return Result.Ok.lift(
                (token: string): IToken.IOutput => ({ token, expired_at }),
            )(encrypted);
        };

    const _verify =
        <Payload extends { expired_at: Regex.DateTime }>(injection: {
            parser: (input: string) => Payload | null;
            decrypt: (
                encrypted: string,
            ) => Result<string, Failure.Internal<"INVALID">>;
        }) =>
        (
            token: string,
        ): Result<
            Payload,
            Failure.Internal<
                ErrorCode.Permission.Invalid | ErrorCode.Permission.Expired
            >
        > => {
            const now = new Date();
            const decrypted = injection.decrypt(token);
            if (Result.Error.is(decrypted))
                return Result.Error.map(
                    new Failure.Internal<ErrorCode.Permission.Invalid>(
                        "INVALID_PERMISSION",
                    ),
                );
            const plain = Result.Ok.flatten(decrypted);
            const payload = injection.parser(plain);
            if (isNull(payload))
                return Result.Error.map(
                    new Failure.Internal<ErrorCode.Permission.Invalid>(
                        "INVALID_PERMISSION",
                    ),
                );
            if (now > new Date(payload.expired_at))
                return Result.Error.map(
                    new Failure.Internal<ErrorCode.Permission.Expired>(
                        "EXPIRED_PERMISSION",
                    ),
                );
            return Result.Ok.map(payload);
        };

    export const generate = _generate({
        mapper: ({ user_id }: IToken.ICreate): IToken.IPayload => ({
            type: "access",
            user_id,
            expired_at: DateMapper.toISO(new Date(Date.now() + duration)),
        }),
        stringify: typia.json.createStringify<IToken.IPayload>(),
        encrypt: (plain) =>
            Crypto.encrypt({ plain, key: Configuration.ACCESS_TOKEN_KEY }),
    });

    export const verify = _verify({
        parser: typia.json.createIsParse<IToken.IPayload>(),
        decrypt: (token) =>
            Crypto.decrypt({ token, key: Configuration.ACCESS_TOKEN_KEY }),
    });
}
