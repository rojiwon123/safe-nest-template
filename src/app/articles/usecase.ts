import { ErrorCode } from '@SRC/common/error_code';
import { Regex } from '@SRC/common/type';
import { Result } from '@SRC/utils/result';
import typia from 'typia';

import { IArticle } from './dto';

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
    ): Promise<Result<IArticle, ErrorCode.Article.NotFound>> => {
        return Result.Ok.map({ ...typia.random<IArticle>(), id: article_id });
    };
}
