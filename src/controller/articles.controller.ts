import core from "@nestia/core";
import * as nest from "@nestjs/common";

import { IArticle } from "@SRC/app/articles/dto";
import { ArticlesUsecase } from "@SRC/app/articles/usecase";
import { Exception } from "@SRC/common/exception";
import { Result } from "@SRC/common/result";
import { Regex } from "@SRC/common/type";

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
    async getList(@core.TypedQuery() query: IArticle.ISearch): Promise<IArticle.IPaginated> {
        return ArticlesUsecase.getList(query);
    }

    /**
     * 게시글 상세 정보를 볼 수 있습니다.
     *
     * @summary 게시글 상세 보기
     * @tag articles
     * @param article_id 게시글 id
     * @return 게시글 상세 정보
     */
    @core.TypedException<Exception.Article.NotFound>(nest.HttpStatus.NOT_FOUND)
    @core.TypedRoute.Get(":article_id")
    async get(@core.TypedParam("article_id") article_id: Regex.UUID): Promise<IArticle> {
        return ArticlesUsecase.get(article_id).then(
            Result.match(
                (ok) => ok,
                (err) => Exception.Http.throw(err, nest.HttpStatus.NOT_FOUND),
            ),
        );
    }
}
