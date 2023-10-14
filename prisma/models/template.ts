import { createModel } from "schemix";

import { Comment } from "../util/comment";
import { Model } from "../util/temp";

export const User = createModel("UserModel", (model) => {
    Model.define(
        model,
        Model.info(
            "users",
            ...Comment.lines("User Root Entity", ""),
            Comment.namespace(),
            Comment.namespace("User"),
            Comment.author(),
        ),
        Model.addId(),
        Model.add("string")("name", {
            comments: Comment.lines("displayed username in service"),
        }),
        Model.add("string")("image_url", {
            optional: true,
            comments: Comment.lines("url path for profile image"),
        }),
        Model.add("string")("email", {
            optional: true,
            comments: Comment.lines("verified email address"),
        }),
        Model.setCreatable,
        Model.setUpdatable,
        Model.setDeletable,
        Model.add("relation")("articles", Article, { list: true }),
        Model.add("relation")("article_comments", ArticleComment, {
            list: true,
        }),
    );
});

export const Article = createModel("ArticleModel", (model) => {
    Model.define(
        model,
        Model.info(
            "articles",
            ...Comment.lines("Article Root Entity", ""),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        ),
        Model.addId(),
        Model.addRelationalString("author")(User, "users"),
        Model.setCreatable,
        Model.setDeletable,
        Model.add("relation")("snapshots", ArticleSnapshot, { list: true }),
        Model.add("relation")("comments", ArticleComment, { list: true }),
    );
});

export const ArticleSnapshot = createModel("ArticleSnapshotModel", (model) => {
    Model.define(
        model,
        Model.info(
            "article_snapshots",
            ...Comment.lines(
                "Snapshot of Article",
                "",
                "a `article_snapshot` contains all content of the article.",
                "",
                "if article update body or title, a new article_snapshot is created.",
                "",
            ),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        ),
        Model.addId(),
        Model.addRelationalString("article")(Article, "articles"),
        Model.add("string")("title", {
            comments: Comment.lines("title of article"),
        }),
        Model.add("string")("body", {
            comments: Comment.lines(
                "content of article",
                "",
                "content is only text with 20,000 limit",
            ),
        }),
        Model.setCreatable,
    );
});

export const ArticleComment = createModel("ArticleCommentModel", (model) => {
    Model.define(
        model,
        Model.info(
            "article_comments",
            ...Comment.lines("Article Comment Root Entity", ""),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        ),
        Model.addId(),
        Model.addRelationalString("article")(Article, "articles"),
        Model.addRelationalString("parent", {
            optional: true,
            comments: Comment.lines(
                "if not null, a comment is reply of parent comment",
            ),
        })(ArticleComment, "article_comments", {
            name: "HierarchicalReply",
        }),
        Model.addRelationalString("author")(User, "users"),
        Model.setCreatable,
        Model.setDeletable,
        Model.add("relation")("snapshots", ArticleCommentSnapshot, {
            list: true,
        }),
        Model.add("relation")("children", ArticleComment, {
            list: true,
            name: "HierarchicalReply",
        }),
    );
});

export const ArticleCommentSnapshot = createModel(
    "ArticleCommentSnapshot",
    (model) => {
        Model.define(
            model,
            Model.info(
                "article_comment_snapshots",
                ...Comment.lines(
                    "Snapshot of Article Comment",
                    "",
                    "a `article_comment_snapshot` contains all content of the comment.",
                    "",
                    "if comment update body or title, a new article_comment_snapshot is created.",
                ),
                Comment.namespace(),
                Comment.namespace("BBS"),
                Comment.author(),
            ),
            Model.addId(),
            Model.addRelationalString("comment")(
                ArticleComment,
                "article_comments",
            ),
            Model.add("string")("content", {
                comments: Comment.lines(
                    "content of comment",
                    "",
                    "content is only text with 1,000 limit",
                ),
            }),
            Model.setCreatable,
        );
    },
);
