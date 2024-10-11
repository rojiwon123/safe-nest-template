# Backend Template

<div align=center>

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

[![Test Status](https://github.com/rojiwon123/nestia-template/actions/workflows/release.yml/badge.svg)](https://github.com/rojiwon123/nestia-template/actions/workflows/release.yml)

</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#소개">소개</a></li>
    <li><a href="#api-문서화">API 문서화 방식</a></li>
    <li><a href="./ERD.md">erd 문서</a></li>
    <li><a href="https://rojiwon123.github.io/nestia-template/">Swagger UI</a></li>
  </ol>
</details>

## 소개

Nestia와 prisma를 미리 적용한 템플릿 프로젝트

### 특징

-   ts 타입기반의 검증 방식 사용

    -   nestia, typia 라이브러리를 활용

-   문서 자동화

    -   swagger api 문서, sdk 라이브러리 자동빌드
    -   prisma model과 연동된 erd 자동빌드

-   e2e test 환경 세팅 적용

-   안전한 merge

    -   github action에서 e2e test를 통한 pr check

## API 문서화

-   swagger, sdk 빌드 명령어

```bash
npm run build:nestia
```

-   swagger-ui 서버 실행

## Appendix

-   [Nestia 공식 가이드](https://nestia.io/docs/)
-   [Typia 공식 가이드](https://typia.io/docs/)
-   [prisma-markdown](https://www.npmjs.com/package/prisma-markdown)
