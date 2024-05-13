import { isNull } from '@fxts/core';
import typia from 'typia';

import { Crypto } from '@SRC/common/crypto';
import { DateUtil } from '@SRC/common/date';
import { Exception } from '@SRC/common/exception';
import { Result } from '@SRC/common/result';
import { Configuration } from '@SRC/infrastructure/config';

import { IAuthentication } from './dto';

export namespace Token {
    const hour = 1000 * 60 * 60 * 1;

    const duration = hour * 3;

    export const generate = ({
        user_id,
    }: Pick<
        IAuthentication.ITokenPayload,
        'user_id'
    >): IAuthentication.IToken => {
        const payload: IAuthentication.ITokenPayload = {
            type: 'access',
            user_id,
            expired_at: DateUtil.toISO(new Date(Date.now() + duration)),
        };
        const expired_at = payload.expired_at;
        const plain = typia.json.stringify(payload);
        const token = Crypto.encrypt({
            plain,
            key: Configuration.ACCESS_TOKEN_KEY,
        });
        return { token, expired_at };
    };

    export const verify = (
        token: string,
    ): Result<
        IAuthentication.ITokenPayload,
        Exception.Authentication.Expired | Exception.Authentication.Invalid
    > => {
        const now = new Date();
        const decrypted = Crypto.decrypt({
            token,
            key: Configuration.ACCESS_TOKEN_KEY,
        });
        if (Result.Error.is(decrypted))
            return Result.Error.map({ code: 'AUTHENTICATION_INVALID' });
        const plain = Result.Ok.flatten(decrypted);
        const payload =
            typia.json.isParse<IAuthentication.ITokenPayload>(plain);
        if (isNull(payload))
            return Result.Error.map({ code: 'AUTHENTICATION_INVALID' });
        if (now > new Date(payload.expired_at))
            return Result.Error.map({ code: 'AUTHENTICATION_EXPIRED' });
        return Result.Ok.map(payload);
    };
}
