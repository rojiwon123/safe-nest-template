import { PrismaModel, createModel } from "schemix";
import { PrismaRelationalField } from "schemix/dist/modules/PrismaRelationalField";
import {
    DateTimeFieldOptions,
    RelationalFieldOptions,
    StringFieldOptions,
} from "schemix/dist/typings/prisma-type-options";
import { handleRelationalOptions } from "schemix/dist/util/options";

import { Omit } from "@APP/types/global";

import { Description } from "./description";
import { Raw } from "./raw";

export namespace Table {
    export const create =
        (tableName: string, ...comments: string[]) =>
        (...fns: ((model: PrismaModel) => PrismaModel)[]) =>
            createModel(tableName, (model) => {
                model.comment(...comments.map(Description.line));
                fns.forEach((fn) => fn(model));
            });

    export const addRelation =
        ({
            tableName,
            fieldName = tableName,
            options = {},
        }: {
            tableName: string;
            fieldName?: string;
            options?: RelationalFieldOptions;
        }) =>
        (model: PrismaModel) => {
            const field = new PrismaRelationalField(fieldName, tableName);
            handleRelationalOptions(field, options);
            setImmediate(() => model["fields"].set(fieldName, field));
            return model;
        };

    export const addColumn =
        <
            T extends keyof Omit<
                PrismaModel,
                "toString" | "name" | "map" | "comment" | "relation"
            >,
        >(
            method: T,
        ) =>
        (...inputs: Parameters<PrismaModel[T]>) =>
        (model: PrismaModel) =>
            (
                model[method] as (
                    ...inpus: Parameters<PrismaModel[T]>
                ) => PrismaModel
            )(...inputs);

    export const addTimestamptz = (
        fieldName: string,
        options: Omit<DateTimeFieldOptions, "raw"> = {},
    ) => addColumn("dateTime")(fieldName, { ...options, raw: Raw.Timestamptz });

    type IdOptions = Omit<
        StringFieldOptions & {
            id: true;
            uuid?: boolean;
        },
        "id" | "comments" | "raw"
    >;
    export const addId = (options: IdOptions = {}) => {
        const { uuid = true, ...fieldOptions } = options;
        return addColumn("string")("id", {
            id: true,
            ...fieldOptions,
            ...(uuid ? { raw: Raw.Uuid } : {}),
            comments: Description.lines(
                "record identity",
                `\`${uuid ? "uuid" : "string"}\` type`,
            ),
        });
    };

    export const setCreatable = addTimestamptz("created_at", {
        comments: Description.lines("creation time of record"),
    });

    export const setUpdatable = addTimestamptz("updated_at", {
        optional: true,
        comments: Description.lines("revision time of record"),
    });

    export const setDeletable = addTimestamptz("deleted_at", {
        optional: true,
        comments: Description.lines(
            "deletion time of record",
            "if null, a record is soft-deleted",
        ),
    });

    type ForeignKeyOptions = Omit<
        StringFieldOptions & {
            id?: never;
            list?: never;
            uuid?: boolean;
        },
        "id" | "raw"
    >;
    type RelationKeyOptions = Omit<
        RelationalFieldOptions & { list?: never },
        "optional"
    >;
    export const addRelationalString =
        (fieldName: string, options: ForeignKeyOptions = {}) =>
        (tableName: string, relationalOptions: RelationKeyOptions = {}) =>
        (model: PrismaModel) => {
            const { uuid = true, comments, ...fieldOptions } = options;
            addColumn("string")(`${fieldName}_id`, {
                ...fieldOptions,
                ...(uuid ? { raw: Raw.Uuid } : {}),
                comments: Description.lines(
                    `referenced in \`${tableName}\``,
                    `\`${uuid ? "uuid" : "string"}\` type`,
                ).concat(...(comments ?? [])),
            })(model);
            return addRelation({
                tableName,
                fieldName,
                options: {
                    fields: [`${fieldName}_id`],
                    references: ["id"],
                    ...(fieldOptions.optional ? { optional: true } : {}),
                    ...relationalOptions,
                },
            })(model);
        };
}
