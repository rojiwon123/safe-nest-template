import typia from 'typia';

import { Exception } from '@SRC/common/exception';
import { Result } from '@SRC/common/result';
import { Regex } from '@SRC/common/type';

import { IArticle } from './dto';

export namespace ArticlesUsecase {
    export const getList = async (
        input: IArticle.ISearch,
    ): Promise<IArticle.IPaginated> => {
        const data = typia.random<IArticle[] & typia.tags.MinItems<10>>();
        const author_id = input.author_id;
        if (author_id)
            data.forEach((article) => (article.author.id = author_id));
        return { data, page: 1, size: 10 };
    };

    export const get = async (
        article_id: Regex.UUID,
    ): Promise<Result<IArticle, Exception.Article.NotFound>> => {
        return Result.Ok({ ...typia.random<IArticle>(), id: article_id });
    };
}
