import typia from "typia";

import { IOauth } from "./IOauth";

export namespace IAuthentication {
    export interface IUrl {
        url: string & typia.tags.Format<"url">;
    }

    export interface IOauthType {
        oauth: IOauth.Type;
    }

    export interface IOauthRequest {
        oauth_type: IOauth.Type;
        code: string;
    }

    /**
     * 토큰 발급시, 제공되는 형태
     */
    export interface ITokenResponse {
        token: string;
        /** 토큰 만료일자 */
        expired_at: string & typia.tags.Format<"date-time">;
    }

    export interface ISignInResponse {
        access_token: ITokenResponse;
        refresh_token: ITokenResponse;
    }

    export interface IRefreshRequest {
        refresh_token: string;
    }

    export interface IRefreshResponse {
        access_token: ITokenResponse;
        /**
         * 만약 리프레시 토큰의 만료일이 얼마 안남은 경우, 리프레스 토큰가 응답 데이터에 추가된다.
         */
        refresh_token?: ITokenResponse;
    }
}
