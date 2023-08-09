# Backend Template

<div align=center>

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

[![Test Status](https://github.com/industriously/nestia-template/actions/workflows/pr_check.yml/badge.svg?branch=develop)](https://github.com/industriously/nestia-template/actions/workflows/pr_check.yml)

</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#소개">소개</a></li>
    <li><a href="#api-문서화">API 문서화 방식</a></li>
    <li><a href="#깃-컨벤션">깃 컨벤션</a></li>
  </ol>
</details>

## 소개

Nestia와 prisma를 미리 적용한 템플릿 프로젝트

### 특징

-   ts 타입 시스템을 최대한 활용

    -   typia를 통한 ts 타입시스템 기반의 타입 검증
    -   nestia를 통한 interface 형식의 DTO 적용
    -   strict 모드!!

-   문서 자동화

    -   nestia기반의 swagger & sdk 자동 빌드

-   e2e test 환경 세팅

    -   nestia/e2e & node:test 기반의 e2e(API) test 환경 세팅완료

-   안전한 merge

    -   github action에서 e2e test를 통한 pr check

## API 문서화

nestia를 통해 swagger, sdk 자동빌드 기능을 지원한다.

-   @nestia/migrate를 사용하면 swagger.json만으로도 fake server 및 sdk 빌드가 가능하다.

### Swagger

```bash
npx @PROJECT/swagger swagger
```

### SDK

```bash
npm i @PROJECT/sdk
```

## 깃 컨벤션

1. 유다시티 컨벤션을 기반으로 깃모지를 활용한 깃 컨벤션을 적용한다.

-   [유다시티 스타일 설명 블로그](https://haesoo9410.tistory.com/300)

-   [깃모지 설명 블로그](https://treasurebear.tistory.com/70)

## 컨벤션 표기 예시

| Udacity  | Gitmoji               | emoji | description                 |
| -------- | --------------------- | ----- | --------------------------- |
| feat     | :sparkles:            | ✨    | 기능 추가                   |
| fix      | :bug:                 | 🐛    | 버그 수정                   |
| hotfix   | :ambulance:           | 🚑    | 긴급 수정                   |
| (hot)fix | :lock:                | 🔒    | 보안 이슈 해결              |
| docs     | :memo:                | 📝    | 문서 업데이트               |
| style    | :art:                 | 🎨    | 코드 구조, 포매팅 관련 수정 |
| style    | :truck:               | 🚚    | 리소스 이동, 이름 변경      |
| refactor | :recycle:             | ♻️    | 프로덕션 코드 리팩토링      |
| test     | :white_check_mark:    | ✅    | 테스트 추가/수정            |
| chore    | :arrow_up:            | ⬆     | dependencies 업데이트       |
| chore    | :construction_worker: | 👷    | CI 빌드 시스템 추가/수정    |
| chore    | :wrench:              | 🔧    | 설정 파일 추가/수정         |
| chore    | :heavy_plus_sign:     | ➕    | dependency 추가             |
| chore    | :heavy_minus_sign:    | ➖    | dependency 제거             |
| chore    | :card_file_box:       | 🗃️    | DB 관련 수정 사항 적용      |
| release  | :bookmark:            | 🔖    | 새로운 버전 출시            |

## Appendix

-   [Nestia 공식 가이드](https://nestia.io/docs/)
-   [Typia 공식 가이드](https://typia.io/docs/)
