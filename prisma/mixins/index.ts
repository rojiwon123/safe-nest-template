import { createMixin } from "schemix";

export const Updatable = createMixin((mixin) => {
    mixin
        .dateTime("created_at", {
            raw: "@database.Timestamptz",
            comments: ["/// 데이터 생성일자", "/// @format date-time"],
        })
        .dateTime("updated_at", {
            raw: "@database.Timestamptz",
            comments: ["/// 최근 수정일자", "/// @format date-time"],
        });
});

export const Deletable = createMixin((mixin) => {
    mixin.mixin(Updatable).dateTime("deleted_at", {
        optional: true,
        raw: "@database.Timestamptz",
        comments: [
            "/// 데이터 삭제일자",
            "/// ",
            "/// 데이터가 null이 아닌 경우, 삭제된 데이터를 의미한다.",
            "/// @format date-time",
        ],
    });
});

export const Entity = createMixin((mixin) => {
    mixin
        .string("id", { id: true, comments: ["// @format uuid"] })
        .mixin(Deletable);
});
