import { createModel } from "schemix";

import { Model } from "../util/Model";
import { Comment } from "../util/comment";

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
        Model.Id(true),
        Model.String("name", {
            comments: Comment.lines("deplayed username in service"),
        }),
        Model.String("image_url", {
            optional: true,
            comments: Comment.lines("url path for profile image"),
        }),
        Model.String("email", {
            optional: true,
            comments: Comment.lines("verified email address"),
        }),
        Model.Creatable,
        Model.Updatable,
        Model.Deletable,
        Model.Relation("articles", Article, { list: true }),
        Model.Relation("article_comments", ArticleComment, { list: true }),
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
        Model.Id(true),
        Model.UuidRelation("author")(User, "users"),
        Model.Creatable,
        Model.Deletable,
        Model.Relation("snapshots", ArticleSnapshot, { list: true }),
        Model.Relation("comments", ArticleComment, { list: true }),
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
                "if article update body or title, a new article_snapshot is created.",
                "",
            ),
            Comment.namespace(),
            Comment.namespace("BBS"),
            Comment.author(),
        ),
        Model.Id(true),
        Model.UuidRelation("article")(Article, "articles"),
        Model.String("title", { comments: Comment.lines("title of article") }),
        Model.String("content", {
            comments: Comment.lines(
                "content of article",
                "content is only text with 20,000 limit",
            ),
        }),
        Model.Creatable,
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
        Model.Id(true),
        Model.UuidRelation("article")(Article, "articles"),
        Model.UuidRelation("parent", {
            optional: true,
            comments: Comment.lines(
                "if not null, a comment is reply of parent comment",
            ),
        })(ArticleComment, "article_comments", {
            name: "HierarchicalReply",
        }),
        Model.UuidRelation("author")(User, "users"),
        Model.Creatable,
        Model.Deletable,
        Model.Relation("snapshots", ArticleCommentSnapshot, { list: true }),
        Model.Relation("children", ArticleComment, {
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
                    "if comment update body or title, a new article_comment_snapshot is created.",
                ),
                Comment.namespace(),
                Comment.namespace("BBS"),
                Comment.author(),
            ),
            Model.Id(true),
            Model.UuidRelation("comment")(ArticleComment, "article_comments"),
            Model.String("content", {
                comments: Comment.lines(
                    "content of comment",
                    "",
                    "content is only text with 1,000 limit",
                ),
            }),
            Model.Creatable,
        );
    },
);
