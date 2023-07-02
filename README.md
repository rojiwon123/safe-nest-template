# Backend Template

<div align=center>

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

[![Test Status](https://github.com/industriously/nestia-template/actions/workflows/pr_check.yml/badge.svg?branch=develop)](https://github.com/industriously/nestia-template/actions/workflows/pr_check.yml)

</div>

## 설명

Nestia와 prisma를 미리 적용한 템플릿 프로젝트

### 해당 템플릿의 특징

-   ts 타입 시스템을 최대한 활용

    -   typia를 통한 ts 타입시스템 기반의 타입 검증
    -   interface 형식의 DTO 정의
    -   strict 모드!!

-   문서 자동화

    -   nestia기반의 swagger & sdk 자동 빌드

-   e2e test 환경 세팅

    -   nestia/e2e & node:test 기반의 e2e test 환경 세팅완료

-   안전한 merge

    -   github action에서 e2e test를 통한 pr check

## API 문서

```bash
npx @PROJECT/swagger swagger
```

## SDK

```bash
npm i @PROJECT/sdk
```
