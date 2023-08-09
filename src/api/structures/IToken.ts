/**
 * 보안 토큰 정보
 */
export interface IToken {
    readonly token: string;
    /**
     * 토큰 만료일자
     *
     * @format date-time
     */
    readonly expired_at: string;
}

export namespace IToken {
    export type Type = "account" | "access" | "refresh";
}
