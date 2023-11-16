import { IPropagation, Primitive } from "@nestia/fetcher";
import typia from "typia";

import { ErrorCode } from "@APP/types/ErrorCode";
import { Failure } from "@APP/utils/failure";
import { fetch, propagate } from "@APP/utils/fetch";
import { Result } from "@APP/utils/result";

export namespace GithubSDK {
    const AUTH_URL = "https://github.com";
    const API_URL = "https://api.github.com";

    export interface IOauth2Options {
        /** The client ID you received from GitHub for your OAuth app. */
        readonly client_id: string;
        /** The client secret you received from GitHub for your OAuth app. */
        readonly client_secret: string;
        /** The URL in your application where users will be sent after authorization. See details below about redirect urls. */
        readonly redirect_uri: string;
        /**
         * A space-delimited list of scopes.
         * If not provided, scope defaults to an empty list for users that have not authorized any scopes for the application.
         * For users who have authorized scopes for the application, the user won't be shown the OAuth authorization page with the list of scopes.
         * Instead, this step of the flow will automatically complete with the set of scopes the user has authorized for the application.
         *
         *  For example, if a user has already performed the web flow twice and has authorized one token with user scope and another token with repo scope, a third web flow that does not provide a scope will receive a token with user and repo scope.
         */
        readonly scope: Scope[];
        /**
         * Whether or not unauthenticated users will be offered an option to sign up for GitHub during the OAuth flow.
         * The default is true. Use false when a policy prohibits signups.
         */
        readonly allow_signup: boolean;
        readonly state?: string;
    }

    const options: IOauth2Options = {
        client_id: "",
        client_secret: "",
        redirect_uri: "",
        scope: ["read:user"],
        allow_signup: true,
    };

    /**
     * Get Url for {@link https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity Request a user's Github identity}
     */
    export const getUrlForAuthorize = (): string =>
        AUTH_URL +
        "/authorize" +
        "?" +
        new URLSearchParams([
            ["client_id", options.client_id],
            ["redirect_uri", options.redirect_uri],
            ["allow_signup", options.allow_signup + ""],
            ["scope", options.scope.join(" ")],
        ]).toString();

    interface IGetAccessToken {
        access_token: string;
        scope: string;
        token_type: "bearer";
    }
    export interface IErrorBody {
        error: string;
        error_description: string;
        error_uri: string;
    }
    /**
     * 성공시 access_token을, 실패시 실패 메시지를 반환합니다.
     *
     * {@link https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github Users are redirected back to your site by GitHub}
     */
    export const getAccessToken = async (
        code: string,
    ): Promise<Result<string, Failure.Internal<ErrorCode.Authentication>>> => {
        try {
            const response = await fetch<
                {
                    client_id: string;
                    client_secret: string;
                    code: string;
                    redirect_uri?: string;
                },
                IGetAccessToken | IErrorBody
            >(
                {
                    host: AUTH_URL,
                    headers: {
                        Accept: "application/json",
                    },
                },
                {
                    method: "POST",
                    path: "/login/oauth/access_token",
                    status: 200,
                    request: {
                        type: "application/json",
                        encrypted: false,
                    },
                    response: {
                        type: "application/json",
                        encrypted: false,
                    },
                },
                {
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    code,
                    redirect_uri: options.redirect_uri,
                },
            );

            return typia.is<IGetAccessToken>(response)
                ? Result.Ok.map(response.access_token)
                : Result.Error.map(new Failure.Internal("AUTHENTICATION_FAIL"));
        } catch {
            return Result.Error.map(
                new Failure.Internal("AUTHENTICATION_FAIL"),
            );
        }
    };

    const get =
        <T extends object>(path: string) =>
        async (
            access_token: string,
        ): Promise<
            Result<Primitive<T>, Failure.Internal<ErrorCode.Authentication>>
        > => {
            const response = (await propagate(
                {
                    host: API_URL,
                    headers: {
                        Authorization: "Bearer " + access_token,
                        Accept: "application/vnd.github+json",
                        "X-Github-Api-Version": "2022-11-28",
                    },
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
            )) as
                | IPropagation.IBranch<true, 200, T>
                | IPropagation.IBranch<false, string, { message: string }>;
            return response.success
                ? Result.Ok.map(response.data)
                : Result.Error.map(new Failure.Internal("AUTHENTICATION_FAIL"));
        };

    export const getUser = get<IUser>("/user");
    export const getEmails = get<IEmail[]>("/user/emails");

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
}
