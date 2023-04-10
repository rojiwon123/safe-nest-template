# Backend Template

<div align=center>

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

[![Test Status](https://github.com/industriously/nestia-template/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/industriously/nestia-template/actions/workflows/ci.yml)

</div>

## 설명

Nestia와 prisma를 미리 적용한 템플릿 프로젝트

### 해당 템플릿의 특징

- nestia를 통한 swagger & sdk 자동 생성
- typia를 통한 interface 기반의 타입 검증
- prisma를 사용해서 orm entity도 interface 형태
- ts strict 모드 사용을 통한 엄격한 타입 시스템 활용
- push & pull request시 자동 테스트 진행
  - pr의 경우, test 결과를 comment로 보고함

## API 문서

- [View in the `Swagger Editor`](https://editor.swagger.io/?url=https://raw.githubusercontent.com/industriously/nestia-template/main/packages/api/swagger.json)
