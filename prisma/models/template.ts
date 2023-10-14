import { Description } from "../util/description";
import { Table } from "../util/table";

Table.create({
    tableName: "users",
    comments: Description.lines(
        "User Root Entity",
        "",
        Description.namespace(),
        Description.namespace("User"),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addColumn("string")("name", {
        comments: Description.lines("displayed username in service"),
    }),
    Table.addColumn("string")("image_url", {
        optional: true,
        comments: Description.lines("url path for profile image"),
    }),
    Table.addColumn("string")("email", {
        optional: true,
        comments: Description.lines("verified email address"),
    }),
    Table.setCreatable,
    Table.setUpdatable,
    Table.setDeletable,
    Table.addRelation({ tableName: "articles", options: { list: true } }),
    Table.addRelation({
        tableName: "article_comments",
        options: { list: true },
    }),
);

Table.create({
    tableName: "articles",
    comments: Description.lines(
        "Article Root Entity",
        "",
        Description.namespace(),
        Description.namespace("BBS"),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addRelationalString("author")("users"),
    Table.setCreatable,
    Table.setDeletable,
    Table.addRelation({
        tableName: "article_snapshots",
        fieldName: "snapshots",
        options: { list: true },
    }),
    Table.addRelation({
        tableName: "article_comments",
        fieldName: "comments",
        options: { list: true },
    }),
);

Table.create({
    tableName: "article_snapshots",
    comments: Description.lines(
        "Snapshot of Article",
        "",
        "a `article_snapshot` contains all content of the article.",
        "",
        "if article update body or title, a new article_snapshot is created.",
        "",
        Description.namespace(),
        Description.namespace("BBS"),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addRelationalString("article")("articles"),
    Table.addColumn("string")("title", {
        comments: Description.lines("title of article"),
    }),
    Table.addColumn("string")("body", {
        comments: Description.lines(
            "content of article",
            "",
            "content is only text with 20,000 limit",
        ),
    }),
    Table.setCreatable,
);

Table.create({
    tableName: "article_comments",
    comments: Description.lines(
        "Article Comment Root Entity",
        "",
        Description.namespace(),
        Description.namespace("BBS"),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addRelationalString("article")("articles"),
    Table.addRelationalString("parent", {
        optional: true,
        comments: Description.lines(
            "if not null, a comment is reply of parent comment",
        ),
    })("article_comments", { name: "HierarchicalReply" }),
    Table.addRelationalString("author")("users"),
    Table.setCreatable,
    Table.setDeletable,
    Table.addRelation({
        tableName: "article_comment_snapshots",
        fieldName: "snapshots",
        options: { list: true },
    }),
    Table.addRelation({
        tableName: "article_comments",
        fieldName: "children",
        options: {
            list: true,
            name: "HierarchicalReply",
        },
    }),
);

Table.create({
    tableName: "article_comment_snapshots",
    comments: Description.lines(
        "Snapshot of Article Comment",
        "",
        "a `article_comment_snapshot` contains all content of the comment.",
        "",
        "if comment update body or title, a new article_comment_snapshot is created.",
        Description.namespace(),
        Description.namespace("BBS"),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addRelationalString("comment")("article_comments"),
    Table.addColumn("string")("content", {
        comments: Description.lines(
            "content of comment",
            "",
            "content is only text with 1,000 limit",
        ),
    }),
    Table.setCreatable,
);
