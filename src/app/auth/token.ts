import typia from 'typia';

import { Crypto } from '@SRC/common/crypto';
import { DateUtil } from '@SRC/common/date';
import { Exception } from '@SRC/common/exception';
import { Option } from '@SRC/common/option';
import { Result } from '@SRC/common/result';
import { Configuration } from '@SRC/infrastructure/config';

import { IAuthentication } from './dto';

export namespace Token {
    const duration = () => DateUtil.hour(3);
    export const generate = ({
        user_id,
    }: Pick<
        IAuthentication.ITokenPayload,
        'user_id'
    >): IAuthentication.IToken => {
        DateUtil.hour(3);
        const payload: IAuthentication.ITokenPayload = {
            type: 'access',
            user_id,
            expired_at: DateUtil.toDateTime(duration()),
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
    > =>
        Crypto.decrypt({
            token,
            key: Configuration.ACCESS_TOKEN_KEY,
        })
            .flatMap((token) =>
                Option.unit(
                    typia.json.isParse<IAuthentication.ITokenPayload>(token),
                ),
            )
            .match(
                (some) =>
                    DateUtil.isExpired(some.expired_at)
                        ? Result.Err({ code: 'AUTHENTICATION_EXPIRED' })
                        : Result.Ok(some),
                () => Result.Err({ code: 'AUTHENTICATION_INVALID' }),
            );
}
