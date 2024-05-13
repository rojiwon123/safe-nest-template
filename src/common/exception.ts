interface IBody<T extends string> {
    /**
     * 예외 분류 코드
     */
    code: T;
    /**
     * 세부 예외 사항
     */
    message?: string;
}

export class Exception extends Error {
    constructor(
        public readonly body: IBody<string>,
        public readonly status: number,
    ) {
        super(body.code);
    }

    static throw(body: IBody<string>, status: number): never {
        throw new Exception(body, status);
    }
}

export namespace Exception {
    export type SystemError = IBody<'SYSTEM_ERROR'>;

    export namespace Authentication {
        export type Required = IBody<'AUTHENTICATION_REQUIRED'>;
        export type Invalid = IBody<'AUTHENTICATION_INVALID'>;
        export type Expired = IBody<'AUTHENTICATION_EXPIRED'>;
    }

    export namespace User {
        export type NotFound = IBody<'USER_NOT_FOUND'>;
        export type AlreadyExist = IBody<'USER_ALREADY_EXIST'>;
    }
    export namespace Article {
        export type NotFound = IBody<'ARTICLE_NOT_FOUND'>;
    }
}
