import psg from "@rojiwon123/prisma-schema-generator";

import { Raw } from "./raw";

export namespace Id {
    export const string = (
        options: psg.IStringOptions & {
            constraint?: "required";
            id?: true;
            unique?: true;
        } = {},
    ) => psg.Field.string("id", { ...options, id: true });

    export const uuid = (
        options: psg.IStringOptions & {
            constraint?: "required";
            id?: true;
            unique?: true;
            raw?: typeof Raw.Uuid;
        } = {},
    ) =>
        string({
            ...options,
            raw: Raw.Uuid,
            comments: (options.comments ?? []).concat("`uuid` string"),
        });

    export const int = (
        options: psg.IIntOptions & {
            constraint?: "required";
            id?: true;
            unique?: true;
        } = {},
    ) => psg.Field.int("id", { ...options, id: true });
}

export namespace Relation {
    export const string = (
        field: string,
        options: psg.IStringOptions &
            psg.IRelationOptions & {
                constraint?: "required" | "nullable";
                id?: false;
            } = {},
    ) => [
        psg.Field.string(field + "_id", {
            ...options,
            comments: (options.comments ?? []).concat(
                `referenced in \`${options.model ?? field}\``,
            ),
        }),
        psg.Field.relation(field, {
            ...options,
            fields: options.fields ?? [field + "_id"],
            references: options.references ?? ["id"],
        }),
    ];

    export const uuid = (
        field: string,
        options: psg.IStringOptions &
            psg.IRelationOptions & {
                constraint?: "required" | "nullable";
                id?: false;
                raw?: typeof Raw.Uuid;
            } = {},
    ) => [
        psg.Field.string(field + "_id", {
            ...options,
            raw: Raw.Uuid,
            comments: (options.comments ?? []).concat(
                `referenced in \`${options.model ?? field}\``,
                "`uuid` string",
            ),
        }),
        psg.Field.relation(field, {
            ...options,
            fields: options.fields ?? [field + "_id"],
            references: options.references ?? ["id"],
        }),
    ];

    export const int = (
        field: string,
        options: psg.IIntOptions &
            psg.IRelationOptions & {
                constraint?: "required" | "nullable";
                id?: false;
            } = {},
    ) => [
        psg.Field.int(field + "_id", {
            ...options,
            comments: (options.comments ?? []).concat(
                `referenced in \`${options.model ?? field}\``,
            ),
        }),
        psg.Field.relation(field, {
            ...options,
            fields: options.fields ?? [field + "_id"],
            references: options.references ?? ["id"],
        }),
    ];
}

export namespace DateTime {
    export const at = (
        field: string,
        nullable: boolean,
        ...comments: string[]
    ): psg.IField =>
        psg.Field.datetime(field, {
            constraint: nullable ? "nullable" : "required",
            raw: Raw.Timestamptz,
            comments,
        });
    export const createdAt = (...comments: string[]) =>
        at("created_at", false, ...comments);
    export const updatedAt = (...comments: string[]) =>
        at("updated_at", true, ...comments);
    export const deletedAt = (...comments: string[]) =>
        at("deleted_at", true, ...comments);
}
