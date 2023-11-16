import { isUndefined } from "@fxts/core";
import assert from "assert";
import typia from "typia";

import { prisma } from "@APP/infrastructure/DB";

import { Prisma } from "../../../db/edge";

export namespace Seed {
    const createUrl = typia.createRandom<string & typia.tags.Format<"url">>();
    const createNullableUrl = typia.createRandom<
        (string & typia.tags.Format<"url">) | null
    >();
    createUrl;
    createNullableUrl;
    class Size {
        private before?: {
            users: {
                total: number;
                deleted: number;
            };
            articles: {
                total: number;
                deleted: number;
            };
        };
        private async count() {
            return {
                users: {
                    total: await prisma.users.count(),
                    deleted: await prisma.users.count({
                        where: { deleted_at: { not: null } },
                    }),
                },
                articles: {
                    total: await prisma.articles.count(),
                    deleted: await prisma.articles.count({
                        where: { deleted_at: { not: null } },
                    }),
                },
            };
        }
        async init() {
            this.before = await this.count();
        }
        async check(): Promise<() => void> {
            const before = this.before;
            if (isUndefined(before)) throw Error("Size does not initalized");
            const after = await this.count();
            return () =>
                assert.deepStrictEqual(after, before, "size is changed");
        }
    }

    export const size = new Size();

    export const check_size_changed = async () => (await size.check())();

    export const init = async () => {
        console.time("seed init");
        await size.init();
        console.timeEnd("seed init");
    };

    export const restore = async () => {
        const truncate = (table: string) =>
            prisma.$queryRaw(Prisma.raw(`TRUNCATE table ${table} cascade`));

        console.time("seed reset");
        await prisma.$transaction([truncate("articles"), truncate("users")]);
        console.timeEnd("seed reset");
    };
}
