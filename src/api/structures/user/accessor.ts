export interface IAccessor {
  readonly access_token: string;
  readonly refresh_token: string;
}

export namespace IAccessor {
  export type OuathType = "google";

  export interface IOauthProfile {
    readonly oauth_type: OuathType;
    readonly name: string;
    /**
     * @format email
     */
    readonly email: string;
    readonly sub: string;
  }

  export interface IOauthSignIn {
    readonly oauth_type: OuathType;
    readonly code: string;
  }
}
