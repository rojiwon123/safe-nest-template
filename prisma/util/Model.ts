import { isUndefined } from "@fxts/core";
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

    const addColumn =
        (col: (model: PrismaModel) => PrismaModel) => (model: PrismaModel) =>
            col(model);

    export const Enum = (...inputs: Parameters<PrismaModel["enum"]>) =>
        addColumn((model) => model.enum(...inputs));
    export const String = (...inputs: Parameters<PrismaModel["string"]>) =>
        addColumn((model) => model.string(...inputs));
    export const Uuid = (fieldName: string, options: StringFieldOptions = {}) =>
        String(fieldName, { ...options, raw: Raw.Uuid });
    export const Decimal = (...inputs: Parameters<PrismaModel["decimal"]>) =>
        addColumn((model) => model.decimal(...inputs));
    export const Int = (...inputs: Parameters<PrismaModel["int"]>) =>
        addColumn((model) => model.int(...inputs));
    export const Float = (...inputs: Parameters<PrismaModel["float"]>) =>
        addColumn((model) => model.float(...inputs));
    export const Boolean = (...inputs: Parameters<PrismaModel["boolean"]>) =>
        addColumn((model) => model.boolean(...inputs));
    export const Timestamptz = (
        fieldName: string,
        options?: Omit<DateTimeFieldOptions, "raw">,
    ) =>
        addColumn((model) =>
            model.dateTime(fieldName, {
                raw: Raw.Timestamptz,
                ...(options ?? {}),
            }),
        );
    export const Relation = (...inputs: Parameters<PrismaModel["relation"]>) =>
        addColumn((model) => model.relation(...inputs));
    export const info =
        (table_name: string, ...comments: `/// ${string}`[]) =>
        (model: PrismaModel) =>
            model.map(table_name).comment(...comments);

    export const Id = (uuid: boolean = true) =>
        addColumn((model) =>
            model.string("id", {
                id: true,
                ...(uuid ? { raw: Raw.Uuid } : {}),
                comments: Comment.lines(
                    `record ${uuid ? "uuid" : "string"} identity`,
                ),
            }),
        );

    export const Creatable = Timestamptz("created_at", {
        comments: Comment.lines("creation time of record"),
    });

    export const Updatable = Timestamptz("updated_at", {
        comments: Comment.lines("revision time of record"),
    });

    export const Deletable = Timestamptz("deleted_at", {
        optional: true,
        comments: Comment.lines(
            "deletion time of record",
            "",
            "if null, a row is soft-deleted data",
        ),
    });

    export const UuidRelation =
        (field: string, options: StringFieldOptions = {}) =>
        (
            relationalModel: PrismaModel,
            tableName: string,
            relationalOptions: RelationalFieldOptions = {},
        ) =>
        (model: PrismaModel) => {
            if (isUndefined(options.comments))
                options.comments = Comment.lines(
                    `referenced in \`${tableName}\``,
                );
            else
                options.comments = [
                    ...Comment.lines(`referenced in \`${tableName}\``, ""),
                    ...options.comments,
                ];

            if (options.optional) relationalOptions.optional = options.optional;
            Uuid(`${field}_id`, {
                ...options,
            })(model);
            return Relation(field, relationalModel, {
                fields: [`${field}_id`],
                references: ["id"],
                ...relationalOptions,
            })(model);
        };
}
