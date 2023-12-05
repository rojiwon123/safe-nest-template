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
    export const createdAt = (): psg.IField =>
        psg.Field.datetime("created_at", {
            raw: Raw.Timestamptz,
            comments: ["creation time of record"],
        });
    export const updatedAt = () =>
        psg.Field.datetime("updated_at", {
            constraint: "nullable",
            raw: Raw.Timestamptz,
            comments: ["revision time of record"],
        });
    export const deletedAt = () =>
        psg.Field.datetime("deleted_at", {
            constraint: "nullable",
            raw: Raw.Timestamptz,
            comments: ["deletion time of record"],
        });
}
