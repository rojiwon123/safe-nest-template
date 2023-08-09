export namespace ErrorCode {
    /**
     * body, query, param 등 사용자로부터 얻은 데이터의 형식이 올바르지 않은 경우
     */
    export type InvalidInput = "INVALID_INPUT";
    /**
     * 인증 관련 에러 코드
     *
     * http 401 상태코드와 함께 응답된다.
     *
     * - `UNAUTHORIZED_REQUEST` : 인증 헤더가 누락된 경우
     * - `INVALID_HEADER_VALUE` : 헤더 값이 올바르지 않은 경우
     */
    export type Authorization = "UNAUTHORIZED_REQUEST" | "INVALID_HEADER_VALUE";

    /**
     * 토큰 인증 에러 코드
     *
     * http 403 상태코드와 함께 응답된다.
     *
     * - `EXPIRED_TOKEN` : 토큰이 만료된 경우
     * - `INVALID_TOKEN` : 토큰이 비정상적인 경우
     */
    export type Token = "EXPIRED_TOKEN" | "INVALID_TOKEN";
    export type UserNotFound = "NOT_FOUND_USER";
}
