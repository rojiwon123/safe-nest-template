interface ErrorCode<T extends string> {
    code: T;
    message?: string;
}
export namespace ErrorCode {
    export namespace Permission {
        export type Required = ErrorCode<'PERMISSION_REQUIRED'>;
        export type Invalid = ErrorCode<'PERMISSION_INVALID'>;
        export type Expired = ErrorCode<'PERMISSION_EXPIRED'>;
    }
    export namespace User {
        export type NotFound = ErrorCode<'USER_NOT_FOUND'>;
        export type AlreadyExist = ErrorCode<'USER_ALREADY_EXIST'>;
    }
    export namespace Article {
        export type NotFound = ErrorCode<'ARTICLE_NOT_FOUND'>;
    }
}
