import { Regex } from "./global";

export namespace IToken {
    export interface IPayload {
        /** 토큰 유형 */
        type: "access";
        /** 사용자 id */
        user_id: Regex.UUID;
        /** 토큰 만료일자 */
        expired_at: Regex.DateTime;
    }
    export interface ICreate extends Pick<IPayload, "user_id"> {}
    export interface IOutput {
        token: string;
        /** 토큰 만료일자 */
        expired_at: Regex.DateTime;
    }
}
