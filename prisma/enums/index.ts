import { createEnum } from "schemix";

export const OauthType = createEnum("OauthType", (Enum) => {
    Enum.addValue("kakao").addValue("github");
});

export const FileReference = createEnum("FileReference", (Enum) => {
    Enum.addValue("external").addValue("s3");
});
