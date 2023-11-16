import { HttpStatus } from "@nestjs/common";

import { Result } from "./result";

/**
 * 오류 처리 모듈
 *
 * - `Internal` 고의적으로 발생시키는 예외
 * - `External` 외부 시스템으로부터 발생된 오류를 담은 객체
 * - `Http` httpRouter로부터 exception-filter로 전달하기 위해 사용됨
 */
export namespace Failure {
    /**
     * 내부적으로 처리 대상인 오류
     *
     * 비즈니스적 예외 사항들
     */
    export class Internal<T extends string = string> extends Error {
        override readonly name: "InternalFailure";
        constructor(override readonly message: T) {
            super(message);
            this.name = "InternalFailure";
        }
        /**
         * function for type narrowing
         *
         * 클래스는 자연스러운 타입 계산이 불가능하므로 원활한 타입연산을 위한 메소드가 필요하다.
         */
        is<R extends T>(message: R): this is Internal<R> {
            return this.message === message;
        } // class method는 readonly로 지정할 수 없다...
    }

    /**
     * 외부 시스템에 의해 발생된 오류
     */
    export interface External<T extends string> {
        /** 오류가 발생한 함수의 이름 */
        readonly origin: T;
        readonly error: Error;
    }
    export namespace External {
        export const get =
            <T extends string>(origin: T) =>
            (error: unknown): External<T> => {
                const _error =
                    error instanceof Error ? error : Error("Unknown Error");
                _error.name = `External(${_error.name})`;
                return {
                    origin,
                    error: _error,
                };
            };
        export const getStack = <T extends string>(external: External<T>) =>
            (external.error.stack ??
                `${external.error.name}: ${external.error.message}`) +
            `\n in ${external.origin}`;

        export const getResult =
            <T extends string>(origin: T) =>
            (error: unknown): Result.Error<External<T>> =>
                Result.Error.map(get(origin)(error));
    }

    export class Http extends Error {
        override readonly name: "HttpFailure";
        constructor(
            override readonly message: string,
            readonly status: HttpStatus,
            readonly log?: string,
        ) {
            super(message);
            this.name = "HttpFailure";
        }

        static fromInternal(internal: Internal, status: HttpStatus) {
            return new Http(internal.message, status);
        }

        static fromExternal(external: External<string>) {
            return new Http(
                external.error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                External.getStack(external),
            );
        }
    }
}
