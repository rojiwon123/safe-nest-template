import { isNull } from "@fxts/core";
import typia from "typia";

import { Configuration } from "@APP/infrastructure/config";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IToken } from "@APP/types/IToken";
import { Regex } from "@APP/types/common";
import { Crypto } from "@APP/utils/crypto";
import { DateUtil } from "@APP/utils/date";
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
            encrypt: (plain: string) => string;
        }) =>
        (input: ICreate): IToken.IOutput => {
            const payload = injection.mapper(input);
            const expired_at = payload.expired_at;
            const plain = injection.stringify(payload);
            const encrypted = injection.encrypt(plain);
            return { token: encrypted, expired_at };
        };

    const _verify =
        <Payload extends { expired_at: Regex.DateTime }>(injection: {
            parser: (input: string) => Payload | null;
            decrypt: (
                encrypted: string,
            ) => Result<string, Failure<ErrorCode.Authentication.Invalid>>;
        }) =>
        (
            token: string,
        ): Result<
            Payload,
            Failure<
                | ErrorCode.Authentication.Expired
                | ErrorCode.Authentication.Invalid
            >
        > => {
            const now = new Date();
            const decrypted = injection.decrypt(token);
            if (Result.Error.is(decrypted))
                return Result.Error.map(new Failure("Authentication Invalid"));
            const plain = Result.Ok.flatten(decrypted);
            const payload = injection.parser(plain);
            if (isNull(payload))
                return Result.Error.map(new Failure("Authentication Invalid"));
            if (now > new Date(payload.expired_at))
                return Result.Error.map(new Failure("Authentication Expired"));
            return Result.Ok.map(payload);
        };

    export const generate = _generate({
        mapper: ({ user_id }: IToken.ICreate): IToken.IPayload => ({
            type: "access",
            user_id,
            expired_at: DateUtil.toISO(new Date(Date.now() + duration)),
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
