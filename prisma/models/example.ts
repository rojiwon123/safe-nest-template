import { Description } from "../util/description";
import { Table } from "../util/table";

Table.create({
    tableName: "users",
    comments: Description.lines(
        "Root Entity of User",
        Description.namespace(),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addColumn("string")("name", {
        comments: Description.lines("displayed name of user"),
    }),
    Table.addColumn("string")("image_url", {
        optional: true,
        comments: Description.lines("url of user profile image"),
    }),
    Table.setCreatable,
    Table.setUpdatable,
    Table.setDeletable,
    Table.addRelation({
        tableName: "articles",
        options: { list: true },
    }),
);

Table.create({
    tableName: "articles",
    comments: Description.lines(
        "Root Entity of Article",
        Description.namespace(),
        Description.author(),
    ),
})(
    Table.addId(),
    Table.addRelationalString("author")("users"),
    Table.addColumn("string")("body"),
    Table.setCreatable,
    Table.setDeletable,
);
