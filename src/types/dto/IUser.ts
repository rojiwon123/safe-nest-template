import { tags } from "typia";

/**
 * 사용자 엔티티
 */
export interface IUser {
    /** 사용자 id */
    id: string;
    /** 사용자명 */
    name: string;
    /** 인증된 이메일 */
    email: (string & tags.Format<"email">) | null;
    /** 프로필 이미지 url */
    image_url: (string & tags.Format<"url">) | null;
    /** 사용자 데이터 생성일자 */
    created_at: string & tags.Format<"date-time">;
    /** 사용자 데이터 수정일자 */
    updated_at: string & tags.Format<"date-time">;
    /** 사용자 데이터 삭제일자 */
    deleted_at: (string & tags.Format<"date-time">) | null;
}
