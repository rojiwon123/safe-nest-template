import { Oauth } from "@APP/externals/oauth";
import { typedModule } from "@APP/utils/fx";

import { IAuthenticationService } from "./interface";

typedModule<IAuthenticationService>(AuthenticationService);

export namespace AuthenticationService {
    export const getLoginUrl: IAuthenticationService["getLoginUrl"] = async (
        oauth_type,
    ) => {
        return Oauth[oauth_type].loginUri;
    };
}
