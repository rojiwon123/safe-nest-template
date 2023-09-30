import { createModel } from "schemix";

import { Entity } from "../mixins";
import { Comment } from "../util/comment";
import { File } from "./file";
import { User } from "./user";

export const Board = createModel("BoardModel", (model) => {
    model
        .mixin(Entity)
        .string("title", { comments: Comment.lines("title of board") })
        .boolean("is_public", {
            comments: Comment.lines("if true, board is public"),
        })
        .string("super_admin_id", {
            comments: Comment.lines(
                "referenced in user root entity",
                "this admin is super administrator",
                "super administrator is only one",
            ),
        })
        .relation("articles", Article, { list: true })
        .relation("super_admin", User, {
            fields: ["super_admin_id"],
            references: ["id"],
        })
        .map("boards")
        .comment(
            ...Comment.lines("board root entity", ""),
            Comment.namespace("All"),
            Comment.namespace("Board"),
            Comment.namespace("Article"),
            Comment.author(),
        );
});

export const Article = createModel("ArticleModel", (model) => {
    model
        .mixin(Entity)
        .string("board_id", {
            optional: true,
            comments: Comment.lines(
                "referenced in board entity",
                "if null, a article is personal article",
            ),
        })
        .string("author_id", {
            comments: Comment.lines(
                "referenced in user entity",
                "author id referenced in user root entity",
            ),
        })
        .relation("author", User, { fields: ["author_id"], references: ["id"] })
        .relation("contents", ArticleContent, { list: true })
        .relation("board", Board, {
            optional: true,
            fields: ["board_id"],
            references: ["id"],
        })
        .map("articles")
        .comment(
            ...Comment.lines(
                "article root entity",
                "",
                "a entity can update only deleted_at",
                "",
            ),
            Comment.namespace("All"),
            Comment.namespace("Board"),
            Comment.namespace("Article"),
            Comment.author(),
        );
});

export const ArticleContent = createModel("AricleContentModel", (model) => {
    model
        .mixin(Entity)
        .string("article_id", {
            comments: Comment.lines("referenced in article root entity"),
        })
        .string("file_id", {
            comments: Comment.lines("referenced in file entity"),
        })
        .int("sequence", { comments: Comment.lines("sequence of content") })
        .relation("article", Article, {
            fields: ["article_id"],
            references: ["id"],
        })
        .relation("file", File, {
            fields: ["file_id"],
            references: ["id"],
        })
        .map("article_contents")
        .comment(
            ...Comment.lines("article content entity", ""),
            Comment.namespace("All"),
            Comment.namespace("Article"),
            Comment.author(),
        );
});
