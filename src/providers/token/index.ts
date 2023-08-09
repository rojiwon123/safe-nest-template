import { IToken } from "@APP/api/structures/IToken";
import { IUser } from "@APP/api/structures/user/IUser";

import { AccessService, AccountService, RefreshService } from "./service";

export type Token = Token.Account | Token.Access | Token.Refresh;

export namespace Token {
    interface IBase<T extends IToken.Type = IToken.Type> {
        readonly type: T;
        /** @format date-time */
        readonly expired_at: string;
    }
    export interface Account extends IBase<"account"> {
        readonly account_id: string;
    }
    export interface Access extends IBase<"access"> {
        readonly user_id: string;
        readonly user_type: IUser.Type;
    }
    export interface Refresh extends IBase<"refresh"> {
        readonly user_id: string;
        readonly user_type: IUser.Type;
    }
    export type ICreate<T extends IBase> = Omit<T, "type" | "expired_at">;

    export const Account = AccountService;
    export const Access = AccessService;
    export const Refresh = RefreshService;
}
