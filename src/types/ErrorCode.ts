export namespace ErrorCode {
    export namespace Authentication {
        export type Required = "Authentication Required";
        export type Invalid = "Authentication Invalid";
        export type Expired = "Authentication Expired";
    }
    export namespace Oauth {
        export type Fail = "Oauth Fail";
    }
    export namespace User {
        export type NotFound = "User Not Found";
        export type AlreadyExist = "User Already Exist";
    }
    export namespace Article {
        export type NotFound = "Article Not Found";
    }
}
