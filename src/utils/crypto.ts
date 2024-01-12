import { isUndefined } from "@fxts/core";
import crypto from "crypto";

import { ErrorCode } from "@APP/types/ErrorCode";

import { Failure } from "./failure";
import { Result } from "./result";

export namespace Crypto {
    const IV_LEN = 12;
    const TAG_LEN = 16;

    /**
     * 문자열 암호화
     * - plain: 평문
     * - key: 암호화 키, 32 byte string
     */
    export const encrypt = ({
        plain,
        key,
    }: {
        plain: string;
        key: string;
    }): string => {
        const iv = crypto.randomBytes(IV_LEN);
        const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, {
            authTagLength: TAG_LEN,
        });
        const encrypted =
            cipher.update(plain, "utf8", "base64") + cipher.final("base64");
        const tag = cipher.getAuthTag();
        return `${iv.toString("base64")}.${tag.toString(
            "base64",
        )}.${encrypted}`;
    };

    /**
     * 암호문 해독
     * - token: encrypt 결과로 얻은 문자열
     * - key: 복호화 키, 32 byte string
     *
     * {@link encrypt}로 암호화한 문자열을 plain text로 해독한다.
     *
     * 복호화에 실패할 수 있다.
     *
     * 잘못된 토큰을 전달시 INVALID_TOKEN 에러를 리턴한다.
     */
    export const decrypt = ({
        token,
        key,
    }: {
        token: string;
        key: string;
    }): Result<string, Failure<ErrorCode.Authentication.Invalid>> => {
        try {
            const [iv, tag, encrypted] = token.split(".");
            if (isUndefined(iv) || isUndefined(tag) || isUndefined(encrypted))
                return Result.Error.map(new Failure("Authentication Invalid"));
            const decipher = crypto
                .createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"))
                .setAuthTag(Buffer.from(tag, "base64"));

            return Result.Ok.map(
                decipher.update(encrypted, "base64", "utf8") +
                    decipher.final("utf8"),
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : undefined;
            return Result.Error.map(
                new Failure("Authentication Invalid", message),
            );
        }
    };
}
