---
layout: series
series: Chat Application 개발일지
seriesIndex: 4
classes: wide
title: "ChatApplication Review(4)"
subtitle: "code study, 설계도, azure cost analysis"
date: 2024-03-17
categories: "개발일지"
---

## 목차

1. 느낀 점
2. 진행 내용
3. 문제 및 해결 방법

---

## 느낀 점

* 팀원 간에 목표를 공유하고 지식을 전파해 두는 것의 어려움과 필요성.
* 공유해야하는 지식들의 다양함과 효율적인 공유 방법.
* 프로젝트를 진행할 때 cost analysis의 중요성.

---

## 진행 내용

* 팀원에게 프로젝트 목표 공유
* 프로젝트 상세 내용 설명 및 진입점 제안
* 설계도 작성
* Azure Cost Analysis

---

## 문제 및 해결 방법

### [1] 모집한 팀원이 프로젝트 작업을 시작하기 위한 목표 공유가 필요했음

### [1] 해결 방법

* 코드를 함께 읽어나가는 study session을 진행함.
* README.md 업데이트를 통해 프로젝트 목표를 제시함.
* mockTestImplementation이라는 브랜치 생성 및 팀원들에게 이를 진입점으로 제안함.
* draw.io를 통한 설계도 작성 및 공유
  * [설계도 링크](https://github.com/kaestro/ChatApplication/wiki/%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%84%A4%EA%B3%84%EB%8F%84)

---

### [2] Azure Cost Analysis

* Azure의 무료 이용 기간이 끝나고 한달 예상 비용이 40만원으로 예측됨.

### [2] 해결 방법

* 현재 Azure 구독을 정지시켜둔 상태.
* 주로 발생하는 비용은 ACR(Azure Container Registry)와 AKS(Azure Kubernetes Service)의 비용으로 예상됨.
* ACR을 Docker Hub로 변경하고, serverless로 전환하여 비용을 절감 가능할 것으로 예상.
