import typia from "typia";

import { ErrorCode } from "@APP/types/ErrorCode";
import { IArticle } from "@APP/types/IArticle";
import { Regex } from "@APP/types/global";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace ArticlesUsecase {
    export const getList = async (
        input: IArticle.ISearch,
    ): Promise<Result.Ok<IArticle.IPaginated>> => {
        const data = typia.random<IArticle[] & typia.tags.MinItems<10>>();
        const author_id = input.author_id;
        if (author_id)
            data.forEach((article) => (article.author.id = author_id));
        return Result.Ok.map({ data, page: 1, size: 10 });
    };

    export const get = async (
        article_id: Regex.UUID,
    ): Promise<
        Result<IArticle, Failure.Internal<ErrorCode.Article.NotFound>>
    > => {
        return Result.Ok.map({ ...typia.random<IArticle>(), id: article_id });
    };
}
