import { createModel } from "schemix";

import { OauthType } from "../enums";
import { Entity } from "../mixins";
import { Comment } from "../util/comment";
import { User } from "./user";

export const OauthAccount = createModel("OauthAccountModel", (model) => {
    model
        .mixin(Entity)
        .string("sub", {
            comments: Comment.lines(
                "user identity referenced in oauth service",
            ),
        })
        .enum("type", OauthType, {
            comments: Comment.lines("oauth service type"),
        })
        .string("name", {
            optional: true,
            comments: Comment.lines("username in oauth service"),
        })
        .string("email", {
            optional: true,
            comments: Comment.lines("verified email in oauth service"),
        })
        .string("image_url", {
            optional: true,
            comments: Comment.lines("profile image url in oauth service"),
        })
        .string("user_id", {
            comments: Comment.lines("referenced in user root entity"),
        })
        .relation("user", User, { fields: ["user_id"], references: ["id"] })
        .map("oauth_accounts")
        .comment(
            ...Comment.lines(
                "oauth authentication entity",
                "",
                "generated when a user signs up through an OAuth service.",
                "",
            ),
            Comment.namespace("All"),
            Comment.namespace("User"),
            Comment.author(),
        );
});
