import { IUser } from "./IUser";

/**
 * 일반 사용자 정보
 */
export interface INormal extends IUser.IBase<"normal"> {}

export namespace INormal {
    export type IPublicProfile = Pick<INormal, "type" | "id" | "name">;
}
