export namespace ErrorCode {
    /** 외부로부터 받은 데이터가 올바르지 않은 경우 */
    export type InvalidInput = "INVALID_INPUT";
    /** oauth 인증이 실패하는 경우 */
    export type Authentication = "AUTHENTICATION_FAIL";
    export namespace Permission {
        /** 권한이 누락된 경우 - 401 */
        export type Required = "REQUIRED_PERMISSION";
        /**
         * 권한이 부족한 경우 - 403
         *
         * 정상적인 사용자이지만 요청을 수행할 권한이 없다.
         *
         * e.g., 작성자가 아닌 사용자가 게시글을 수정하는 경우
         */
        export type Insufficient = "INSUFFICIENT_PERMISSION";
        /**
         * 권한이 만료된 경우 - 401
         *
         * e.g., 권한 토큰이 만료된 경우
         */
        export type Expired = "EXPIRED_PERMISSION";
        /**
         * 권한이 비정상적인 경우 - 401
         *
         * e.g., 토큰의 사용자가 존재하지 않거나 삭제된 경우, 토큰이 비정상적인 경우
         */
        export type Invalid = "INVALID_PERMISSION";
    }
    export namespace User {
        export type NotFound = "NOT_FOUND_USER";
        export type AlreadyExist = "ALREADY_EXIST_USER";
        export type Invalid = "INVALID_USER";
    }
    export namespace Article {
        export type NotFound = "NOT_FOUND_ARTICLE";
    }
}
