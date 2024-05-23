---
layout: series
series: Chat Application 개발일지
seriesIndex: 11
classes: wide
title: "ChatApplication Review(11)"
subtitle: "작성중"
date: 2024-05-16
categories: "개발일지"
---

## 목차

- [목차](#목차)
- [배운 점](#배운-점)
- [진행 내용](#진행-내용)
- [진행 과정](#진행-과정)
  - [client의 load test debugging](#client의-load-test-debugging)
    - [signout이 진행이 안되고 있었음](#signout이-진행이-안되고-있었음)
    - [enterchat 요청이 받아들여지지 않고 있었음](#enterchat-요청이-받아들여지지-않고-있었음)

---

## 배운 점

- 주고받는 데이터 프로토콜 정확성의 중요성
- 로그를 어느 정도까지 디테일하게 찍어주느냐의 중요성

---

## 진행 내용

- client의 load test debugging

---

## 진행 과정

### client의 load test debugging

1. signout이 진행이 안되고 있었음
2. enterchat 요청이 받아들여지지 않고 있었음

#### signout이 진행이 안되고 있었음

loadtest에서 header에 value의 key를 sessionkey로 보내고 있었는데 Session-Key가 올바른 키의 이름이었음.

#### enterchat 요청이 받아들여지지 않고 있었음

(진행중)
