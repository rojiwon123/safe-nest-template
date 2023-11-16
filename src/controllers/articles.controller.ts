import core from "@nestia/core";
import * as nest from "@nestjs/common";

import { ArticlesUsecase } from "@APP/application/articles.usecase";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IArticle } from "@APP/types/IArticle";
import { Regex } from "@APP/types/global";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

@nest.Controller("articles")
export class ArticlesController {
    /**
     * 게시글 목록을 불러옵니다.
     *
     * @summary 게시글 목록 보기
     * @tag articles
     * @return 게시글 목록
     */
    @core.TypedRoute.Get()
    async getList(
        @core.TypedQuery() query: IArticle.ISearch,
    ): Promise<IArticle.IPaginated> {
        const result = await ArticlesUsecase.getList(query);
        return Result.Ok.flatten(result);
    }

    /**
     * 게시글 상세 정보를 볼 수 있습니다.
     *
     * @summary 게시글 상세 보기
     * @tag articles
     * @param article_id 게시글 id
     * @return 게시글 상세 정보
     */
    @core.TypedException<ErrorCode.Article.NotFound>(nest.HttpStatus.NOT_FOUND)
    @core.TypedRoute.Get(":article_id")
    async get(
        @core.TypedParam("article_id") article_id: Regex.UUID,
    ): Promise<IArticle> {
        const result = await ArticlesUsecase.get(article_id);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        throw Failure.Http.fromInternal(error, nest.HttpStatus.NOT_FOUND);
    }
}
