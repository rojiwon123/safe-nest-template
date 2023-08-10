import { IToken, ITokenService } from "./interface";
import { AccessService, AccountService, RefreshService } from "./service";

export const Token: Token = {
    AccountService,
    AccessService,
    RefreshService,
};

export interface Token {
    readonly AccountService: ITokenService<IToken.IAccount>;
    readonly AccessService: ITokenService<IToken.IAccess>;
    readonly RefreshService: ITokenService<IToken.IRefresh>;
}
