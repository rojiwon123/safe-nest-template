import { createMixin } from "schemix";

import { Comment } from "../util/comment";

export const Creatable = createMixin((mixin) => {
    mixin.dateTime("created_at", {
        raw: "@database.Timestamptz",
        comments: Comment.lines("created time"),
    });
});
export const Updatable = createMixin((mixin) => {
    mixin.dateTime("updated_at", {
        raw: "@database.Timestamptz",
        comments: Comment.lines("updated time"),
    });
});

export const Deletable = createMixin((mixin) => {
    mixin.dateTime("deleted_at", {
        optional: true,
        raw: "@database.Timestamptz",
        comments: Comment.lines(
            "deleted time",
            "",
            "if null, a row is deleted data",
        ),
    });
});

export const Entity = createMixin((mixin) => {
    mixin
        .string("id", { id: true, comments: Comment.lines("entity identity") })
        .mixin(Creatable)
        .mixin(Deletable);
});
