import psg from "@rojiwon123/prisma-schema-generator";

import { DateTime, Id, Relation } from "./util/mixin";
import { Tag } from "./util/tag";

psg.Model("users", {
    comments: [
        "Root Entity of User",
        Tag.namespace(),
        Tag.namespace("User"),
        Tag.author(),
    ],
})(
    Id.uuid(),
    psg.Field.string("name", { comments: ["displayed name of user"] }),
    psg.Field.string("image_url", {
        constraint: "nullable",
        comments: ["url of user profile image"],
    }),
    DateTime.createdAt(),
    DateTime.updatedAt(),
    DateTime.deletedAt(),
    psg.Field.relation("articles", { constraint: "list" }),
);

psg.Model("articles", {
    comments: ["Root Entity of Article", Tag.namespace(), Tag.author()],
})(
    Id.uuid(),
    ...Relation.uuid("author", { model: "users" }),
    psg.Field.string("body"),
    DateTime.createdAt(),
    DateTime.deletedAt(),
);
