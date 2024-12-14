import { randomBytes, randomInt, randomUUID } from "crypto";
import { Option } from "effect";
import typia from "typia";

export namespace Make {
    export const uuid = (): string => randomUUID();
    /** `min <= n < max` */
    export const int = ({ min = 0, max = min + 1 }: { min?: number; max?: number }): number => randomInt(min, max);
    /** `0 <= n < max` */
    export const double = (input: { min?: number; max?: number }): number => Math.random() + int(input);
    export const string = (input: { min?: number; max?: number }) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const length = int(input);
        return Array.from({ length }, () => chars.charAt(int({ max: chars.length }))).join("");
    };
    export const base64 = (byteLength: number) => randomBytes(byteLength).toString("base64url");
    export const datetime = typia.createRandom<string & typia.tags.Format<"date-time">>();

    /**
     * 전달된 `closure`를 한 번만 실행하며 결과값을 공유합니다.
     *
     * 지연 평가된 sigleton 객체를 정의할 때 사용합니다.
     */
    export const once = <T>(closure: () => T) => {
        let value: Option.Option<T> = Option.none();
        return (): T => {
            const some = Option.match(value, { onSome: (i) => i, onNone: closure });
            value = Option.some(some);
            return some;
        };
    };
}
