import { IOauth } from "./IOauth";
import { IToken } from "./IToken";
import { Regex } from "./global";

export interface IAuthentication {
    access_token: IToken.IOutput;
}

export namespace IAuthentication {
    export type IOauthUrls = Record<IOauth.Type, Regex.URL>;
    export interface IOauthInput {
        oauth_type: IOauth.Type;
        code: string;
    }
}
