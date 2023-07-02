import { IResult } from "@APP/api/types";
import { IToken } from "./interface";
import { Crypto, DateMapper, Result } from "@APP/utils";
import { Configuration } from "@APP/infrastructure/config";
import typia from "typia";

export namespace Token {
    const hour = 1000 * 60 * 60 * 1;
    // const day = hour * 24;

    const _verify = <T extends IToken.IBase>({
        token,
        key,
        parser,
    }: {
        token: string;
        key: string;
        parser: (input: string) => T;
    }): IResult<
        T,
        "Token Expired" | "Token Invalid" | "Inner System Error"
    > => {
        const now = new Date();
        const plain = Crypto.decrypt({ token, key });

        if (Result.Error.is(plain))
            return Result.Error.map("Inner System Error" as const); // invalid key or node throw error

        const payload = parser(Result.Ok.flatten(plain));
        const expired_at = new Date(payload.expired_at);
        if (now > expired_at) {
            return Result.Error.map("Token Expired" as const);
        }
        return Result.Ok.map(payload);
    };

    export namespace Access {
        const duration = hour * 8;
        const key = Configuration.ACCESS_TOKEN_KEY;

        export const generate = (
            payload: Omit<IToken.IAccess, "type" | "expired_at">,
        ): IResult<
            {
                access_token: string;
                expired_at: string;
            },
            null
        > => {
            const expired_at = DateMapper.toISO(
                new Date(Date.now() + duration),
            );
            const plain = typia.stringify<IToken.IAccess>({
                ...payload,
                type: "bearer",
                expired_at,
            });
            const access_token = Crypto.encrypt({ plain, key });
            if (Result.Error.is(access_token)) return Result.Error.map(null);
            return Result.Ok.map({
                access_token: Result.Ok.flatten(access_token),
                expired_at,
            });
        };

        export const verify = (
            access_token: string,
        ): IResult<
            IToken.IAccess,
            "Token Expired" | "Token Invalid" | "Inner System Error"
        > =>
            _verify({
                token: access_token,
                parser: typia.createAssertParse<IToken.IAccess>(),
                key,
            });
    }
}
