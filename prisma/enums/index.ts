import { createEnum } from "schemix";

export const OauthType = createEnum("OauthType", (Enum) => {
    Enum.addValue("kakao").addValue("github");
});
