export interface IAuthenticationService {
    readonly getLoginUrl: (
        oauth_type: IAuthentication.OuathType,
    ) => Promise<string>;
}

export namespace IAuthentication {
    export type OuathType = "kakao" | "github";
}
