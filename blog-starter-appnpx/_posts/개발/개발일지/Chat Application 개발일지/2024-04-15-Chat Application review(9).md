---
layout: series
series: Chat Application 개발일지
seriesIndex: 9
classes: wide
title: "ChatApplication Review(9)"
subtitle: "EnterChat 재설계, logging 기능 구현, routes 패키지 추가"
date: 2024-04-15
categories: "개발일지"
---

## 목차

- [목차](#목차)
- [배운 점](#배운-점)
- [진행 내용](#진행-내용)
- [진행 과정](#진행-과정)
  - [EnterChat 재설계 및 구현](#enterchat-재설계-및-구현)
  - [logging 기능 구현](#logging-기능-구현)
  - [routes 패키지 추가](#routes-패키지-추가)
  - [chat 테스트 CI에 추가](#chat-테스트-ci에-추가)

---

## 배운 점

1. 혼자서 개발하는 것과 팀으로 개발하는 것의 차이
2. 잘못된 설계를 재설계하는 방법 및 설계의 중요성
3. 시스템 구축의 어려움
4. docker 서비스간 의존성 해소 방법
5. 문제 발생의 주 원인은 휴먼에러다.

---

## 진행 내용

- EnterChat 재설계 및 구현
- logging 기능 구현
- routes 패키지 추가
- chat 테스트 CI에 추가

---

## 진행 과정

### EnterChat 재설계 및 구현

- **문제**
  - websocket이 연결되는 방식에 대한 이해 부족에 따른 잘못된 설계
    - 접속 정보를 request body로 전송
    - http request로 접속 정보를 전송 후 소켓 연결을 저장해두지 않음
- **해결**
  - websocket을 요청할 때 client.do가 아니라 dialer.Dial로 연결해서 connection을 저장
  - 접속 정보 중 비밀번호를 제외한 정보를 loginSessionInfo라는 새로운 구조체로 전송
  - 이 때 request body가 아닌 header에 저장
- **결과**
  - 채팅 메시지 송수신 확인

### logging 기능 구현

- **문제**
  - 로그를 print로만 출력하고 있어서 디버깅이 어려움
  - debug 로그만 남기고 있어, release 버전용 로그 기능이 필요함
- **해결**
  - gin의 Logger middleware를 통한 initialization을 구현
  - 해당 과정에서 logging 패키지 추가

### routes 패키지 추가

- **문제**
  - routes를 main.go에 직접 작성하고 있어 가독성과 확장성이 떨어짐
- **해결**
  - routes 패키지를 추가하여 routes를 분리

### chat 테스트 CI에 추가

- **문제**
  - 기존에 db와의 연결 혹은 websocket 연결이 필요한 테스트를 CI에 추가하지 않음
  - 이에 대한 테스트를 수동으로 진행함
- **해결**
  - chat 테스트를 CI에 추가
  - github actions의 로그를 별도의 파일로 저장해서 확인 기능 추가

---
