import { Fetcher } from "@nestia/fetcher";

import { Configuration } from "@APP/infrastructure/config";

import { IKakaoOauth2Options, IMeResponse, ITokens } from "./interface";

export namespace Kakao {
    const AUTH_URL = "https://kauth.kakao.com";
    const API_URL = "https://kapi.kakao.com";

    const options: IKakaoOauth2Options = {
        client_id: Configuration.KAKAO_CLIENT_ID,
        client_secret: Configuration.KAKAO_CLIENT_SECRET,
        redirect_uri: Configuration.KAKAO_REDIRECT_URI,
        service_terms: [],
        prompt: "login",
    };

    export const LoginUri = ((options: IKakaoOauth2Options): string => {
        const { client_id, redirect_uri, prompt, service_terms, state, nonce } =
            options;
        const path = "/oauth/authorize";
        const search_params = new URLSearchParams({
            client_id,
            redirect_uri,
            ...(prompt ? { prompt } : {}),
            ...(service_terms.length > 0
                ? { service_terms: service_terms.join(",") }
                : {}),
            ...(state ? { state } : {}),
            ...(nonce ? { nonce } : {}),
            response_type: "code",
        }).toString();
        return AUTH_URL + path + "?" + search_params;
    })(options);

    /**
     * @throw HttpError
     */
    export const getTokens = (
        ({ client_id, client_secret, redirect_uri }: IKakaoOauth2Options) =>
        (code: string): Promise<ITokens> =>
            Fetcher.fetch<string, ITokens>(
                {
                    host: API_URL,
                    headers: {
                        "User-Agent": "request",
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=utf-8",
                    },
                },
                {
                    status: 200,
                    response: false,
                },
                "POST",
                "/oauth/token",
                new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id,
                    redirect_uri,
                    code,
                    ...(client_secret ? { client_secret } : {}),
                }).toString(),
            )
    )(options);

    /**
     * @throw HttpError
     */
    export const getMe = (access_token: string): Promise<IMeResponse> =>
        Fetcher.fetch<IMeResponse>(
            {
                host: API_URL,
                headers: {
                    "User-Agent": "request",
                    Authorization: `Bearer ${access_token}`,
                },
            },
            { response: false, status: 200 },
            "GET",
            "/v2/user/me",
        );
}
