import { isError, Kakao } from "@devts/authjs";
import { Configuration } from "@INFRA/config";
import { Exception } from "./exception";

const kakao_options: Kakao.IOauth2Options = {
  client_id: Configuration.KAKAO_CLIENT_ID,
  client_secret: Configuration.KAKAO_CLIENT_SECRET,
  redirect_uri: Configuration.KAKAO_REDIRECT_URI,
  service_terms: [],
  prompt: "login"
};
const kakao_login_url = Kakao.getLoginUri(kakao_options);
const kakao_getTokens = Kakao.getTokens(kakao_options);

export const Oauth = {
  async kakao(code: string) {
    const tokens = await kakao_getTokens(code);
    if (isError(tokens)) throw Exception.AuthenticationFail;
    const me = await Kakao.getMe(tokens.result.access_token);
    if (isError(me)) throw Exception.AuthenticationFail;
    return me.result;
  },
  kakao_login_url: kakao_login_url
};
