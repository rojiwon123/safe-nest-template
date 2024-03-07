import { ErrorCode } from '@SRC/common/error_code';
import { Regex } from '@SRC/common/type';
import { Result } from '@SRC/utils/result';
import typia from 'typia';

import { IArticle } from './dto';

export namespace Article {
    export const get =
        () =>
        async (input: {
            id: Regex.UUID;
        }): Promise<Result<IArticle, ErrorCode.Article.NotFound>> => {
            return Result.Ok.map({ ...typia.random<IArticle>(), id: input.id });
        };
}
