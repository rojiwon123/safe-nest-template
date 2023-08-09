import { IAuthentication } from "@APP/api/structures/IAuthentication";

import { Service } from "./service";

export const AuthenticationService: AuthenticationService = Service;

export interface AuthenticationService {
    readonly getLoginUrl: (
        oauth_type: IAuthentication.OuathType,
    ) => Promise<string>;
}
