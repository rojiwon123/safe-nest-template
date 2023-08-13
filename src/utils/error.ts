import { isString, isUndefined } from "@fxts/core";

import { DateMapper } from "./date";

/**
 * 내부 처리에서 사용되는 에러 클래스
 *
 * api등을 통해 처리될 때는 별도의 처리 과정이 존재해야 한다.
 */
export class InternalFailure<T extends string = string> extends Error {
    /**
     * 애플리케이션 내부 에러임을 나타내기 위한 에러 이름
     */
    override readonly name: "InternalFailure";
    override readonly stack: string;

    constructor(override readonly message: T) {
        super(message);
        this.name = "InternalFailure";
        this.stack = super.stack ?? `InternalError: ${message}`;
    }

    /**
     * function for type narrowing
     *
     * 클래스는 자연스러운 타입 계산이 불가능하므로 원활한 타입연산을 위한 메소드가 필요하다.
     */
    is<R extends T>(message: R): this is InternalFailure<R> {
        return this.message === message;
    } // class method는 readonly로 지정할 수 없다...
}

/**
 * nodejs 내장 모듈 혹은 외부 시스템으로부터 발생된 에러 객체를 담은 객체
 */
export interface ExternalFailure<T extends string> {
    /** InternalFailure와 구분하는 용도로써 사용 */
    readonly name: "ExternalFailure";
    /** 에러 발생 함수 */
    readonly at: T;
    /** 에러 메시지 */
    readonly message: string;
}

export namespace ExternalFailure {
    interface Input<T extends string> {
        at: T;
        input?: unknown;
        error: unknown;
    }
    const getMessage = <T extends string>({
        at,
        input,
        error,
    }: Input<T>): string => {
        const exception =
            error instanceof Error
                ? `${error.name}: ${error.message}`
                : JSON.stringify(error);
        const fn = isUndefined(input)
            ? `${at}()`
            : `${at}(${JSON.stringify(input)})`;
        return exception + "\n" + fn + "\n" + DateMapper.toISO();
    };
    export const create = <T extends string>(
        input: Input<T>,
    ): ExternalFailure<T> => ({
        name: "ExternalFailure",
        at: input.at,
        message: getMessage(input),
    });
}

export class HttpFailure extends Error {
    override readonly name: "HttpFailure";
    override readonly stack?: string;

    constructor(
        override readonly message: string,
        readonly status: number,
        _stack?: string,
    ) {
        super(message);
        this.name = "HttpFailure";
        if (isString(_stack)) this.stack = _stack;
    }
}
