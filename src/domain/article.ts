import typia from "typia";

import { ErrorCode } from "@APP/types/ErrorCode";
import { IArticle } from "@APP/types/IArticle";
import { Regex } from "@APP/types/common";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace Article {
    export const get =
        () =>
        async (input: {
            id: Regex.UUID;
        }): Promise<Result<IArticle, Failure<ErrorCode.Article.NotFound>>> => {
            return Result.Ok.map({ ...typia.random<IArticle>(), id: input.id });
        };
}
