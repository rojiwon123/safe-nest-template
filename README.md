# Backend Template

<div align=center>

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

[![Test Status](https://github.com/rojiwon123/nestia-template/actions/workflows/release.yml/badge.svg)](https://github.com/rojiwon123/nestia-template/actions/workflows/release.yml)

</div>

type-safe한 nestjs 개발 환경을 만들기 위한 템플릿 프로젝트입니다.

nestia, prisma, effect-ts를 적용했습니다.

### 참고 자료

- [타입 시스템으로 개발 생산성 높이기 - 개발 환경편](https://medium.com/@dev.rojiwon/%ED%83%80%EC%9E%85-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9C%BC%EB%A1%9C-%EA%B0%9C%EB%B0%9C-%EC%83%9D%EC%82%B0%EC%84%B1-%EB%86%92%EC%9D%B4%EA%B8%B0-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD%ED%8E%B8-138fab8e62a2)

## 특징

### TS 타입 기반 API 문서 자동화

```ts
import { Article } from "@SRC/app/article/article.dto";
import { Controller, Get, Param } from "@nestjs/common";

@Controller("articles")
export class ArticlesController {
    /**
     * api description
     *
     * @summary Get article
     * @tag Article
     * @security bearer
     * @param article_id id of article
     * @return Article Detail
     */
    @Get(":article_id")
    async get(@Param("article_id") article_id: string & typia.tags.Format<"uuid">): Promise<Article> {
        throw Error("not impl");
    }
}
```

### Prisma schema 기반 ERD 자동 생성

- generated by [primsa-markdown](https://github.com/samchon/prisma-markdown)

- ![generated-swagger](https://github.com/user-attachments/assets/904c7b6b-e853-4c18-af0e-25708431aa0e)

## 명령어

### 빌드

- `npm run build` : 애플리케이션 빌드
- `npm run build:nestia` : nestia 기반으로 swagger api 문서, sdk 라이브러리 자동 빌드
- `npm run build:prisma` : prisma client & erd 자동 빌드
- `npm run build:test` : e2e test 환경 빌드

### 실행

- `npm start` : 개발환경 서버 실행
- `npm test` : 테스트 실행
    - `npm test -- [options] [test name]` : --only, --skip options 지원

### db

- `npm run db:sync` : prisma migration 동기화
- `npm run db:console` : prisma studio 실행

## CI/CD

- `main` branch PR 생성시 github action에서 테스트 자동화 및 리포트 작성

## Appendix

- [Nestia 공식 가이드](https://nestia.io/docs/)
- [Typia 공식 가이드](https://typia.io/docs/)
- [prisma-markdown](https://www.npmjs.com/package/prisma-markdown)
