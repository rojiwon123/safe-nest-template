import { tags } from "typia";

export namespace IOauth {
    export type Type = "kakao" | "github";
    /**
     * 외부 서비스로부터 얻은 사용자 프로필 정보
     *
     * 해당 정보를 기반으로 사용자 프로필을 생성한다.
     */
    export interface IProfile {
        /** 사용자명 */
        name: string;
        /** 인증된 이메일 */
        email: (string & tags.Format<"email">) | null;
        /** 프로필 이미지 */
        image_url: (string & tags.Format<"url">) | null;
    }

    export interface IGetLoginUrl {
        oauth: Type;
    }
}