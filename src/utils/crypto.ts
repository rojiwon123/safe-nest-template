import { isUndefined } from "@fxts/core";

import crypto from "crypto";
import { Result } from "./result";
import { IResult } from "@APP/api/types";

export namespace Crypto {
    const IV_LEN = 12;
    const TAG_LEN = 16;

    /**
     * 문자열 암호화
     * - plain: 평문
     * - key: 암호화 키, 32 byte string
     *
     * 암호화 형식에 맞지 않는 key를 입력했거나 기타 이유로 암호화에 실패할 수 있다.
     */
    export const encrypt = ({
        plain,
        key,
    }: {
        plain: string;
        key: string;
    }): IResult<string, null> => {
        try {
            const iv = crypto.randomBytes(IV_LEN);
            const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, {
                authTagLength: TAG_LEN,
            });
            const encrypted =
                cipher.update(plain, "utf8", "base64") + cipher.final("base64");
            const tag = cipher.getAuthTag();
            return Result.Ok.map(
                `${iv.toString("base64")}.${tag.toString(
                    "base64",
                )}.${encrypted}`,
            );
        } catch {
            return Result.Error.map(null);
        }
    };

    /**
     * 암호문 해독
     * - token: encrypt 결과로 얻은 문자열
     * - key: 복호화 키, 32 byte string
     *
     * {@link encrypt}로 암호화한 문자열을 plain text로 해독한다.
     *
     * 복호화에 실패할 수 있다.
     */
    export const decrypt = ({
        token,
        key,
    }: {
        token: string;
        key: string;
    }): IResult<string, null> => {
        try {
            const [iv, tag, encrypted] = token.split(".");
            if (isUndefined(iv) || isUndefined(tag) || isUndefined(encrypted))
                return Result.Error.map(null);

            const decipher = crypto
                .createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"))
                .setAuthTag(Buffer.from(tag, "base64"));

            return Result.Ok.map(
                decipher.update(encrypted, "base64", "utf8") +
                    decipher.final("utf8"),
            );
        } catch {
            return Result.Error.map(null);
        }
    };
}
