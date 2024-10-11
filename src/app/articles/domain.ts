import typia from "typia";

import { Exception } from "@SRC/common/exception";
import { Result } from "@SRC/common/result";
import { Regex } from "@SRC/common/type";

import { IArticle } from "./dto";

export namespace Article {
    export const get =
        () =>
        async (input: { id: Regex.UUID }): Promise<Result<IArticle, Exception.Article.NotFound>> =>
            Result.Ok({ ...typia.random<IArticle>(), id: input.id });
}
