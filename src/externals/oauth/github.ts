import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";

export namespace Github {
    const AUTH_URL = "https://github.com/login/oauth";
    const API_URL = "https://api.github.com";

    const options: IOauth2Options = {
        client_id: "",
        client_secret: "",
        redirect_uri: "",
        scope: [],
    };

    export const LoginUri = ((options: IOauth2Options): string => {
        const {
            client_id,
            client_secret,
            redirect_uri,
            scope,
            allow_signup = true,
        } = options;
        return (
            AUTH_URL +
            "/authorize" +
            "?" +
            new URLSearchParams([
                ["client_id", client_id],
                ["client_secret", client_secret],
                ["redirect_uri", redirect_uri],
                ["allow_signup", allow_signup + ""],
                ["scope", scope.join(" ")],
            ]).toString()
        );
    })(options);

    export const getTokens = (
        ({ client_id, client_secret }: IOauth2Options) =>
        (code: string): Promise<ITokens> =>
            PlainFetcher.fetch(
                {
                    host: AUTH_URL,
                    headers: {
                        "User-Agent": "request",
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                },
                {
                    method: "POST",
                    path: "/access_token",
                    request: {
                        type: "application/json",
                        encrypted: false,
                    },
                    response: {
                        type: "application/json",
                        encrypted: false,
                    },
                    status: 200,
                },
                {
                    client_id,
                    client_secret,
                    code,
                },
            )
    )(options);

    const get =
        <T>(path: string) =>
        (access_token: string) =>
            PlainFetcher.fetch<T>(
                {
                    host: API_URL,
                    headers: {
                        "User-Agent": "request",
                        Authorization: "Bearer " + access_token,
                        Accept: "application/vnd.github+json",
                        "X-Github-Api-Version": "2022-11-28",
                    },
                    simulate: true,
                },
                {
                    method: "GET",
                    path,
                    request: null,
                    response: {
                        type: "application/json",
                        encrypted: false,
                    },
                    status: 200,
                },
            );

    export const getUser = get<IUser>("/user");

    export const getEmails = get<IEmail[]>("/user/emails");

    export interface IOauth2Options {
        readonly client_id: string;
        readonly client_secret: string;
        readonly redirect_uri: string;
        readonly scope: Scope[];
        readonly allow_signup?: boolean;
    }

    export type Scope =
        | "repo"
        | "repo:status"
        | "repo_deployment"
        | "public_repo"
        | "repo:invite"
        | "security_events"
        | "admin:repo_hook"
        | "write:repo_hook"
        | "read:repo_hook"
        | "admin:org"
        | "write:org"
        | "read:org"
        | "admin:public_key"
        | "write:public_key"
        | "read:public_key"
        | "admin:org_hook"
        | "gist"
        | "notifications"
        | "user"
        | "read:user"
        | "user:email"
        | "user:follow"
        | "project"
        | "read:project"
        | "delete_repo"
        | "write:discussion"
        | "read:discussion"
        | "write:packages"
        | "read:packages"
        | "delete:packages"
        | "admin:gpg_key"
        | "write:gpg_key"
        | "read:gpg_key"
        | "codespace"
        | "workflow";

    /**
     * If options's scope don't include 'user' or 'read:user', you will get PublicUser.
     */
    export interface IPublicUser {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string | null;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
        name: string | null;
        company: string | null;
        blog: string | null;
        location: string | null;
        email: string | null;
        hireable: boolean | null;
        bio: string | null;
        twitter_username?: string | null;
        public_repos: number;
        public_gists: number;
        followers: number;
        following: number;
        created_at: string;
        updated_at: string;
        plan?: {
            collaborators: number;
            name: string;
            space: number;
            private_repos: number;
            [k: string]: unknown;
        };
        suspended_at?: string | null;
        private_gists?: number;
        total_private_repos?: number;
        owned_private_repos?: number;
        disk_usage?: number;
        collaborators?: number;
    }
    /**
     * If option's scope include 'user' or 'read:user', you will get PrivateUser.
     */
    export interface IPrivateUser extends IPublicUser {
        private_gists: number;
        total_private_repos: number;
        owned_private_repos: number;
        disk_usage: number;
        collaborators: number;
        two_factor_authentication: boolean;
        business_plus?: boolean;
        ldap_dn?: string;
        [k: string]: unknown;
    }

    export type IUser = IPublicUser | IPrivateUser;

    export interface IEmail {
        /** @format email */
        email: string;
        primary: boolean;
        verified: boolean;
        visibility: "public" | "private" | null;
        [k: string]: unknown;
    }

    export interface ITokens {
        access_token: string;
        token_type: string;
        scope: string;
        expires_in?: string;
        refresh_token?: string;
        refresh_token_expires_in?: string;
    }

    export interface IErrorBody {
        error: string;
        error_description: string;
        error_uri: string;
    }
}
