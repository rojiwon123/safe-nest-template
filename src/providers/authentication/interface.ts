export namespace IToken {
    export type Type = "bearer";

    export interface IBase<T extends Type = Type> {
        readonly type: T;
        /** @format date-time */
        readonly expired_at: string;
    }

    export interface IAccess extends IBase<"bearer"> {
        readonly user_id: string;
    }
}
