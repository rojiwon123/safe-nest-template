import { createModel } from "schemix";

import { Deletable, Entity, Updatable } from "../mixins";
import { Comment } from "../util/comment";

export const User = createModel("UserModel", (model) => {
    model
        .mixin(Entity)
        .mixin(Updatable)
        .mixin(Deletable)
        .string("name", {
            comments: Comment.lines("deplayed username in service"),
        })
        .string("profile_image_url", {
            optional: true,
            comments: Comment.lines("url path for profile image"),
        })
        .string("email", {
            optional: true,
            comments: Comment.lines("verified email address"),
        })
        .relation("articles", Article, { list: true })
        .relation("article_comments", ArticleComment, { list: true })
        .map("users")
        .comment(
            ...Comment.lines("User Root Entity", ""),
            Comment.namespace(),
            Comment.namespace("User"),
            Comment.author(),
        );
});

export const Article = createModel("ArticleModel", (model) => {
    model
        .mixin(Entity)
        .mixin(Deletable)
        .string("author_id", {
            comments: Comment.lines("referenced in user root entity"),
        })
        .relation("author", User, { fields: ["author_id"], references: ["id"] })
        .relation("snapshots", ArticleSnapshot, { list: true })
        .relation("comments", ArticleComment, { list: true })
        .map("articles")
        .comment(
            ...Comment.lines("Article Root Entity", ""),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        );
});

export const ArticleSnapshot = createModel("ArticleSnapshotModel", (model) => {
    model
        .mixin(Entity)
        .string("article_id", {
            comments: Comment.lines("referenced in article root entity"),
        })
        .string("title", { comments: Comment.lines("title of article") })
        .string("content", {
            comments: Comment.lines(
                "content of article",
                "content is only text with 20,000 limit",
            ),
        })
        .relation("article", Article, {
            fields: ["article_id"],
            references: ["id"],
        })
        .map("article_snapshots")
        .comment(
            ...Comment.lines(
                "Snapshot of Article",
                "",
                "a `article_snapshot` contains all content of the article.",
                "if article update body or title, a new article_snapshot is created.",
                "",
            ),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        );
});

export const ArticleComment = createModel("ArticleCommentModel", (model) => {
    model
        .mixin(Entity)
        .mixin(Deletable)
        .string("article_id", {
            comments: Comment.lines("referenced in article root entity"),
        })
        .relation("article", Article, {
            fields: ["article_id"],
            references: ["id"],
        })
        .string("parent_id", {
            optional: true,
            comments: Comment.lines(
                "referenced in article comment root entity",
                "if not null, a comment is reply of parent comment",
            ),
        })
        .relation("parent", ArticleComment, {
            optional: true,
            name: "HierarchicalReply",
            fields: ["parent_id"],
            references: ["id"],
        })
        .string("author_id", {
            comments: Comment.lines("referenced in user root entity"),
        })
        .relation("author", User, { fields: ["author_id"], references: ["id"] })
        .relation("snapshots", ArticleCommentSnapshot, { list: true })
        .relation("children", ArticleComment, {
            list: true,
            name: "HierarchicalReply",
        })
        .map("article_comments")
        .comment(
            ...Comment.lines("Article Comment Root Entity", ""),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        );
});

export const ArticleCommentSnapshot = createModel(
    "ArticleCommentSnapshot",
    (model) => {
        model
            .mixin(Entity)
            .string("comment_id", {
                comments: Comment.lines(
                    "referenced in article comment root entity",
                ),
            })
            .relation("comment", ArticleComment, {
                fields: ["comment_id"],
                references: ["id"],
            })
            .string("content", {
                comments: Comment.lines(
                    "content of comment",
                    "content is only text with 1,000 limit",
                ),
            })
            .map("article_comment_snapshots")
            .comment(
                ...Comment.lines(
                    "Snapshot of Article Comment",
                    "",
                    "a `article_comment_snapshot` contains all content of the comment.",
                    "if comment update body or title, a new article_comment_snapshot is created.",
                ),
                Comment.namespace(),
                Comment.namespace("BBS"),
                Comment.author(),
            );
    },
);
