import { PrismaModel } from "schemix";
import {
    DateTimeFieldOptions,
    RelationalFieldOptions,
    StringFieldOptions,
} from "schemix/dist/typings/prisma-type-options";

import { Omit } from "@APP/types/Omit";

import { Comment } from "./comment";
import { Raw } from "./raw";

export namespace Model {
    export const define = (
        model: PrismaModel,
        ...fns: ((model: PrismaModel) => PrismaModel)[]
    ) => fns.forEach((fn) => fn(model));

    export const info =
        (table_name: string, ...comments: `/// ${string}`[]) =>
        (model: PrismaModel) =>
            model.map(table_name).comment(...comments);

    export const add =
        <T extends keyof Omit<PrismaModel, "toString" | "name">>(method: T) =>
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
    ) => add("dateTime")(fieldName, { ...options, raw: Raw.Timestamptz });

    export const addId = (
        options: Omit<
            StringFieldOptions & {
                id: true;
                uuid?: boolean;
            },
            "id" | "comments" | "raw"
        > = {},
    ) => {
        const { uuid = true, ...fieldOptions } = options;
        return add("string")("id", {
            id: true,
            ...fieldOptions,
            ...(uuid ? { raw: Raw.Uuid } : {}),
            comments: Comment.lines(
                "record identity",
                "",
                `\`${uuid ? "uuid" : "string"}\` type`,
            ),
        });
    };

    export const setCreatable = addTimestamptz("created_at", {
        comments: Comment.lines("creation time of record"),
    });

    export const setUpdatable = addTimestamptz("updated_at", {
        comments: Comment.lines("revision time of record"),
    });

    export const setDeletable = addTimestamptz("deleted_at", {
        optional: true,
        comments: Comment.lines(
            "deletion time of record",
            "",
            "if null, a record is soft-deleted",
        ),
    });

    export const addRelationalString =
        (
            fieldName: string,
            options: Omit<
                StringFieldOptions & {
                    id?: never;
                    list?: never;
                    uuid?: boolean;
                },
                "id" | "raw"
            > = {},
        ) =>
        (
            relationalModel: PrismaModel,
            tableName: string,
            relationalOptions: Omit<
                RelationalFieldOptions & { list?: never },
                "optional"
            > = {},
        ) =>
        (model: PrismaModel) => {
            const { uuid = true, comments, ...fieldOptions } = options;

            add("string")(`${fieldName}_id`, {
                ...fieldOptions,
                ...(uuid ? { raw: Raw.Uuid } : {}),
                comments: comments
                    ? [
                          ...Comment.lines(
                              `referenced in \`${tableName}\``,
                              "",
                          ),
                          ...comments,
                      ]
                    : Comment.lines(`referenced in \`${tableName}\``),
            })(model);
            return add("relation")(fieldName, relationalModel, {
                fields: [`${fieldName}_id`],
                references: ["id"],
                ...(fieldOptions.optional ? { optional: true } : {}),
                ...relationalOptions,
            })(model);
        };
}
