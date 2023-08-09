/**
 * 내부 처리에서 사용되는 에러 클래스
 *
 * api등을 통해 처리될 때는 별도의 처리 과정이 존재해야 한다.
 */
export class InternalFailure<T extends string = string> extends Error {
    /**
     * 애플리케이션 내부 에러임을 나타내기 위한 에러 이름
     */
    override readonly name: "InternalError";
    override readonly stack: string;
    override readonly cause: undefined;

    constructor(override readonly message: T) {
        super(message);
        this.name = "InternalError";
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
    /**
     * InternalError와 구분하는 용도로써 사용
     */
    readonly name: "ExternalError";
    /**
     * error가 발생된 애플리케이션의 위치
     */
    readonly at: T;
    /**
     * 외부 시스템으로부터 발생한 에러 객체
     */
    readonly error: unknown;
}

export namespace ExternalFailure {
    export const get = <T extends string>(
        at: T,
        error: unknown,
    ): ExternalFailure<T> => ({ name: "ExternalError", at, error });
}

export class HttpFailure<E extends InternalFailure | ExternalFailure<string>> {
    readonly name: "HttpError";

    constructor(
        readonly message: string,
        readonly status: number,
        /**
         * 원본 에러 객체
         *
         * 로깅이 필요한 경우 추가한다.
         */
        readonly orignal?: E,
    ) {
        this.name = "HttpError";
    }
}
