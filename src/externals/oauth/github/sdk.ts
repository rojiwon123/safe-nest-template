import { Fetcher } from "@nestia/fetcher";
import { IEmail, IGithubOauth2Options, ITokens, IUser } from "./interface";

export namespace Github {
    const AUTH_URL = "https://github.com/login/oauth";
    const API_URL = "https://api.github.com";

    const options: IGithubOauth2Options = {
        client_id: "",
        client_secret: "",
        redirect_uri: "",
        scope: [],
    };

    export const LoginUri = ((options: IGithubOauth2Options): string => {
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
        ({ client_id, client_secret }: IGithubOauth2Options) =>
        (code: string): Promise<ITokens> =>
            Fetcher.fetch(
                {
                    host: AUTH_URL,
                    headers: {
                        "User-Agent": "request",
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                },
                {
                    response: false,
                    status: 200,
                },
                "POST",
                "/access_token",
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
            Fetcher.fetch<T>(
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
                    response: false,
                    status: 200,
                },
                "GET",
                path,
            );

    export const getUser = get<IUser>("/user");

    export const getEmails = get<IEmail[]>("/user/emails");
}
