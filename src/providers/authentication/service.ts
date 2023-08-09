import { IAuthentication } from "@APP/api/structures/IAuthentication";
import { Oauth } from "@APP/externals/oauth";

export namespace Service {
    export const getLoginUrl = async (
        oauth_type: IAuthentication.OuathType,
    ): Promise<string> => {
        return Oauth[oauth_type].loginUri;
    };
}
