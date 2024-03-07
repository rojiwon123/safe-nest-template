export namespace ErrorCode {
    export namespace Permission {
        export type Required = 'PERMISSION_REQUIRED';
        export type Invalid = 'PERMISSION_INVALID';
        export type Expired = 'PERMISSION_EXPIRED';
    }
    export namespace User {
        export type NotFound = 'USER_NOT_FOUND';
        export type AlreadyExist = 'USER_ALREADY_EXIST';
    }
    export namespace Article {
        export type NotFound = 'ARTICLE_NOT_FOUND';
    }
}
