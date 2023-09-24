import { TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { Authentication } from "@APP/app/authentication";
import { IAuthentication } from "@APP/types/dto/IAuthentication";

@Controller("auth")
export class AuthenticationController {
    @TypedRoute.Get("oauth")
    getUrl(@TypedQuery() query: IAuthentication.IGetLoginUrl): Promise<string> {
        return Authentication.getLoginUrl(query.oauth);
    }
}
