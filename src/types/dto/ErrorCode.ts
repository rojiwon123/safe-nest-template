export namespace ErrorCode {
    /**
     * body, query, param 등 사용자로부터 얻은 데이터의 형식이 올바르지 않은 경우
     */
    export type InvalidInput = "INVALID_INPUT";
    /**
     * 인증 헤더가 누락되거나 올바르지 않은 경우
     */
    export type Authorization = "UNAUTHORIZED_REQUEST";

    export type Token = Token.Expired | Token.Invalid;
    export namespace Token {
        /** 토큰이 만료된 경우 */
        export type Expired = "EXPIRED_TOKEN";
        /** 토큰이 비정상적인 경우 */
        export type Invalid = "INVALID_TOKEN";
    }

    export namespace User {
        export type NotFound = "NOT_FOUND_USER";
        export type AlreadyExist = "ALREADY_EXIST_USER";
    }
}
