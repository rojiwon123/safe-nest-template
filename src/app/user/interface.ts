export namespace IUser {
    export type Type = "normal" | "admin";

    export interface IBase<T extends Type> {
        /**
         * 사용자 유형
         */
        readonly type: T;
        /**
         * 사용자 식별 정보
         */
        readonly id: string;
        /**
         * 사용자명
         */
        readonly name: string;
        /**
         * 사용자 이메일
         *
         * @format email
         */
        readonly email: string;
        /**
         * 사용자 정보 생성일
         *
         * @format date-time
         */
        readonly created_at: string;
        /**
         * 최신 정보 수정일
         *
         * @format date-time
         */
        readonly updated_at: string;
        /**
         * 삭제(비활성화) 유무
         */
        readonly is_deleted: boolean;
        /**
         * 삭제(비활성화) 일시
         */
        readonly deleted_at: string;
        /**
         * 승인 유무
         */
        readonly is_verified: boolean;
    }
}
