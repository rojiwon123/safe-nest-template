import * as map from "./../../utils/map";
import { Oauth } from "@APP/externals/oauth";
import { mocker } from "./mocker";
import typia from "typia";
import { IMeResponse, ITokens } from "@APP/externals/oauth/kakao/interface";

export const mock = async () => {
    mocker({
        module: Oauth.Kakao,
        exporter: "getTokens",
        mocked: async () => typia.random<ITokens>(),
    });
    mocker({
        module: Oauth.Kakao,
        exporter: "getMe",
        mocked: async () => typia.random<IMeResponse>(),
    });
    mocker({
        module: map,
        exporter: "pick",
        mocked:
            <T extends object, K extends keyof T>(key: K) =>
            (obj: T) => {
                console.log("pick mocked");
                return obj[key];
            },
    });
};
