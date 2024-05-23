---
layout: series
series: Chat Application 개발일지
seriesIndex: 10
classes: wide
title: "ChatApplication Review(10)"
subtitle: "test용 클라이언트 작성, pre-commit 도입, docker 시스템 구축 시도 및 실패"
date: 2024-05-06
categories: "개발일지"
---

## 목차

- [목차](#목차)
- [배운 점](#배운-점)
- [진행 내용](#진행-내용)
- [진행 과정](#진행-과정)
  - [grafana k6를 통한 테스트용 client 작성](#grafana-k6를-통한-테스트용-client-작성)
  - [pre-commit을 통한 코드 품질 관리 도입](#pre-commit을-통한-코드-품질-관리-도입)
  - [docker를 통한 시스템 구축 시도 및 실패](#docker를-통한-시스템-구축-시도-및-실패)

---

## 배운 점

1. grafana k6의 사용법
2. 섣부른 시스템 구축의 위험성

---

## 진행 내용

- grafana k6를 통한 테스트용 client 작성
- pre-commit을 통한 코드 품질 관리 도입
- docker를 통한 시스템 구축 시도 및 실패

---

## 진행 과정

### grafana k6를 통한 테스트용 client 작성

![테스트 클라이언트](/images/chatapplication%20review/testclient.png)

- javascript, grafana k6를 통해 테스트용 클라이언트 작성
- httpRequests, loadTest, utils 패키지로 구성
- 기본 모듈단 작성 완료했으며, 이후에는 테스트 케이스를 작성할 예정

---

### pre-commit을 통한 코드 품질 관리 도입

- **문제**
  - 완전히 코드가 저장되지 않은 상태로 커밋을 하거나, 코드의 품질이 낮은 상태로 커밋을 하는 경우가 발생
- **해결**
  - pre-commit을 통해 코드 품질을 관리하고, 코드가 저장되지 않은 상태로 커밋하는 것을 방지
- **결과**

![pre-commit](/images/chatapplication%20review/precommit.png)

---

### docker를 통한 시스템 구축 시도 및 실패

- **문제**
  - docker를 통해 부하 테스트 시스템을 구축하려 했으나, mounting volume이나 복잡한 명령어 사용 등에 어려움을 겪음
- **해결**
  - docker를 통한 부하 테스트 시스템 구축 포기 및 로컬 환경에서 진행하기로 결정
- **결과**
  - 부하테스트 작성 시작
