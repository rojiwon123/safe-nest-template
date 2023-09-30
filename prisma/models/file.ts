import { createModel } from "schemix";

import { FileReference } from "../enums";
import { Entity } from "../mixins";
import { Comment } from "../util/comment";
import "./board";
import { ArticleContent } from "./board";
import { User } from "./user";

export const File = createModel("FileModel", (model) => {
    model
        .mixin(Entity)
        .string("name", { comments: Comment.lines("filename") })
        .string("extension", {
            comments: Comment.lines(
                "file extension",
                "",
                "e.g) html, md, txt, jpg...",
            ),
        })
        .string("url", { comments: Comment.lines("url of real file") })
        .boolean("is_public", {
            comments: Comment.lines("if true, a file is public"),
        })
        .enum("reference", FileReference, {
            comments: Comment.lines("reference of file"),
        })
        .relation("users", User, { list: true })
        .relation("article_contents", ArticleContent, { list: true })
        .map("files")
        .comment(
            ...Comment.lines(
                "external file entity",
                "",
                "a entity can update only deleted_at",
                "",
            ),
            Comment.namespace("All"),
            Comment.namespace("Article"),
            Comment.namespace("User"),
            Comment.author(),
        );
});
