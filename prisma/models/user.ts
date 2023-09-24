import { createModel } from "schemix";

import { Entity } from "../mixins";
import { Comment } from "../util/comment";

export const User = createModel("UserModel", (model) => {
    model
        .mixin(Entity)
        .string("name", { comments: ["/// 서비스에 표시되는 사용자명"] })
        .string("image_url", {
            optional: true,
            comments: ["/// 사용자 프로필 이미지 url", "/// @format url"],
        })
        .string("email", {
            optional: true,
            comments: ["/// 인증된 이메일 주소", "/// @format email"],
        })
        .map("users")
        .comment(
            ...Comment({
                namespace: "Users",
                author: "industriously",
            })(`사용자 기본정보
            
            서비스에 가입시 생성되는 사용자 기본 정보`),
        );
});
