import { createModel } from "schemix";

import { Entity, Updatable } from "../mixins";
import { Comment } from "../util/comment";
import { OauthAccount } from "./account";
import { Article, Board } from "./board";
import { File } from "./file";

export const User = createModel("UserModel", (model) => {
    model
        .mixin(Entity)
        .mixin(Updatable)
        .string("name", {
            comments: Comment.lines("displayed username in service"),
        })
        .string("profile_image_id", {
            optional: true,
            comments: Comment.lines("referenced in file entity"),
        })
        .string("email", {
            optional: true,
            comments: Comment.lines("verified email address"),
        })
        .relation("oauth_accounts", OauthAccount, { list: true })
        .relation("profile_image", File, {
            optional: true,
            fields: ["profile_image_id"],
            references: ["id"],
        })
        .relation("articles", Article, { list: true })
        .relation("boards", Board, { list: true })
        .map("users")
        .comment(
            ...Comment.lines("user root entity", ""),
            Comment.namespace("All"),
            Comment.namespace("User"),
            Comment.namespace("Board"),
            Comment.namespace("Article"),
            Comment.author(),
        );
});
