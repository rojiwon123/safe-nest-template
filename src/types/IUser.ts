import { Regex } from "./global";

export interface IUser {
    id: Regex.UUID;
    /** 프로필 이미지 주소 */
    image_url: Regex.URL | null;
    /** 사용자명 */
    name: string;
    created_at: Regex.DateTime;
    updated_at: Regex.DateTime | null;
}
