import { Oauth } from "@APP/externals/oauth";

import { IAuthenticationService } from "./interface";

export namespace Service {
    export const getLoginUrl: IAuthenticationService["getLoginUrl"] = async (
        oauth_type,
    ): Promise<string> => {
        return Oauth[oauth_type].loginUri;
    };
}
