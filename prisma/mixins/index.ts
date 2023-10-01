import { createMixin } from "schemix";

import { Comment } from "../util/comment";

export const Creatable = createMixin((mixin) => {
    mixin.dateTime("created_at", {
        raw: "@database.Timestamptz",
        comments: Comment.lines("creation time of record"),
    });
});
export const Updatable = createMixin((mixin) => {
    mixin.dateTime("updated_at", {
        raw: "@database.Timestamptz",
        comments: Comment.lines("revision time of record"),
    });
});

export const Deletable = createMixin((mixin) => {
    mixin.dateTime("deleted_at", {
        optional: true,
        raw: "@database.Timestamptz",
        comments: Comment.lines(
            "deletion time of record",
            "",
            "if null, a row is soft-deleted data",
        ),
    });
});

export const Entity = createMixin((mixin) => {
    mixin
        .string("id", {
            id: true,
            raw: "@database.Uuid",
            comments: Comment.lines("entity uuid identity"),
        })
        .mixin(Creatable);
});
