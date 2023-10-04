import { tags } from "typia";

/** 보안 토큰 페이로드 */
export type IToken = IToken.IAccess | IToken.IRefresh;

export namespace IToken {
    export type Type = "access" | "refresh";
    interface IBase<T extends Type = Type> {
        /** 토큰 유형 */
        type: T;
        user_id: string;
        /** 토큰 만료 일자 */
        expired_at: string & tags.Format<"date-time">;
    }
    export interface IAccess extends IBase<"access"> {}
    export interface IRefresh extends IBase<"refresh"> {
        /**
         * 토큰 식별 코드
         *
         * 해당 정보를 통해 리프레시 토큰의 유효성을 판단한다.
         */
        id: string;
        /** 토큰 생성 일자 */
        created_at: string & tags.Format<"date-time">;
    }
}
