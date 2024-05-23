---
layout: series
series: Chat Application 개발일지
seriesIndex: 8
classes: wide
title: "ChatApplication Review(8)"
subtitle: "팀 해체, 모듈 재설계 및 구현, CI 환경 구축"
date: 2024-04-10
categories: "개발일지"
---

## 목차

- [목차](#목차)
- [배운 점](#배운-점)
- [진행 내용](#진행-내용)
- [진행 과정](#진행-과정)
  - [팀 해체](#팀-해체)
  - [Chat 모듈 구현](#chat-모듈-구현)
    - [Client/Room 로직 재설계 및 구현](#clientroom-로직-재설계-및-구현)
    - [디버깅 및 테스트](#디버깅-및-테스트)
  - [API 모듈 구현](#api-모듈-구현)
    - [API 로직 분리 및 테스트 구현](#api-로직-분리-및-테스트-구현)
  - [CI 환경 구축](#ci-환경-구축)
    - [docker-compose](#docker-compose)
    - [github actions](#github-actions)

---

## 배운 점

1. 혼자서 개발하는 것과 팀으로 개발하는 것의 차이
2. 잘못된 설계를 재설계하는 방법 및 설계의 중요성
3. 시스템 구축의 어려움
4. docker 서비스간 의존성 해소 방법
5. 문제 발생의 주 원인은 휴먼에러다.

---

## 진행 내용

- 팀 해체
- Chat 모듈 구현
- api 모듈 구현
- CI 환경 구축

---

## 진행 과정

### 팀 해체

- **문제**
  - 팀원 간의 기술 스택 이해도, 투여 시간 등의 차이로 협업의 장점이 발휘되지 않음
  - 상대방에게 의존성을 강제한 협업 방식이 참여율이 저조해지면서
    - code review가 없으면 pull request가 승인 되지 않음
    - 독립적인 모듈들의 개발의 통합까지 도달하지 못함
- **해결**
  - 팀 해체
- **결과**
  - 실력과 현재 상황에 맞는 목표 재설정
  - 개발 속도 향상

결국 해체하기는 했지만, 다른 사람과 협업할 때 그 사람들과 소통하는 방법이나 이를 위해 통합 환경을 구축하는 방법에 대해서 배울 수 있었다. 또한 혼자서 개발을 진행했다면 구체적이고 실현 가능한 목표 설정에는 도달하는데는 지금보다 더 오랜 시간이 걸렸을 것이라 생각한다.

---

### Chat 모듈 구현

#### Client/Room 로직 재설계 및 구현

![image](https://imgur.com/eKEJVT0.jpg)

- **문제**
  - Client, Room 객체가 너무 많은 역할을 수행하고 있었음
  - 한 개의 방이 여러 클라이언트를 가지는 구조에 대한 고려가 된 설계가 아니었음
  - 하나의 client가 연결된 방마다 websocket connection을 가지고 있어야 해서 load가 높음

- **[해결](https://github.com/kaestro/ChatApplication/tree/main/myapp/internal/chat)**
  - Client, Room의 역할을 분리하는 객체를 추가
    - clientManager, roomManager: client, room의 관리를 담당. 생성, 삭제, 조회 등의 기능을 제공한다.
    - clientSession: client에서 room으로의 연결을 담당. client의 메시지를 room에 전달한다.
    - roomClientHandler: room에서 client로의 연결을 담당. room의 메시지를 client에 전달한다.
  - 구조 변경
    - roomManager에서 관리하는 key를 roomName이라는 변수로 고정. 이에 따라 roomId를 삭제
    - client는 여러 연결을 clientSession으로 관리
    - room은 여러 연결을 roomClientHandler로 관리
    - chatManager를 제외한 객체의 메소드는 private으로 변경
  - client 재설계
    - client는 websocket을 하나만 가지고, room 별로 chan을 clientSession을 통해 가진다.
    - 이에 따라 메시지는 단순 byte가 아니라 ChatMessage 구조체로 전달한다.
    - 이를 위한 ChatMessage 구조체를 정의하고, json으로 marshal/unmarshal하는 함수를 추가한다.

여러 연결을 서로 가져야 하는 m to n 관계에서 중간 객체를 추가하여 관리하는 방법을 배웠다. 이를 통해 client와 room의 역할을 명확히 구분하고, 각 객체의 역할을 명확히 할 수 있었다. 결과적으로 client와 room의 수명을 분리하여 관리할 수 있게 되는 등 코드의 전반적인 유연성과 가독성이 향상되었다.

#### 디버깅 및 테스트

- **문제**
  - 함수의 파라미터, 반환값의 타입이 겹치는 것이 많아 순서를 틀리는 휴먼 에러가 주 원인이 되었음
  - 소켓 프로그래밍 프로세스 및 프로토콜에 대한 이해 부족
  - 설계 이상으로 필요한 하위 모듈이 많아짐
- **해결 방안**
  - types, jsonProperties 패키지를 추가하여 타입을 명확히 구분
  - 이들을 이용한 재구조화 진행 예정.
  - 모듈의 추가적인 분리 및 통합을 진행하고 테스트 코드를 작성할 예정
  - 소켓의 handshake와 같은 프로토콜에 대한 이해를 높이기 위한 학습 예정

시스템적으로 사람이 실수할 수 있는 부분을 최소화하기 위한 노력이 많이 필요하고, 이것이 가장 많은 시간을 소요하는 부분이었다. 컴퓨터가 이해하는 코드를 짜는 것은 쉽지만, 사람이 이해하는 코드를 짜는 것은 어렵다.

---

### API 모듈 구현

#### API 로직 분리 및 테스트 구현

![image](https://imgur.com/BJgnieR.jpg)

- **문제**
  - 기존의 모듈이 handler와 logic이 혼재되어 확장성(테스트, 로직 변경 및 추가)이 떨어짐
  - 테스트 코드에 대한 규약을 변경하면서 기존의 테스트 코드에 대한 전면적인 수정이 필요함

- **해결**
  - logic과 handler를 분리
  - 해당 과정에서 로직을 더 작은 단위로 나누어 작성
  - handler와 loginc에 대한 테스트 코드 작성

handler와 service를 분리하는 이유에 대해 이해할 수 있었다. 이를 구분함으로써 handler는 요청을 받아서 응답을 보내는 역할만 하게 되었고, logic은 handler에게 요청을 받아서 데이터를 처리하는 역할만 하게 되었다. 이를 통해 각각의 테스트 코드를 작성하고 신뢰성을 확보하기 용이하고, 유연한 코드 작성을 통해 코드의 확장성을 높일 수 있었다.

### CI 환경 구축

#### docker-compose

```yml
# docker-compose.yml
version: '3'
services:
  postgresql:
    image: postgres:latest
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_PASSWORD=rootpassword
    ports:
      - "5432:5432"
    volumes:
      - postgresql_data:/var/lib/postgresql/data

  db_init:
    build: ./db_init
    environment:
      - POSTGRES_PASSWORD=rootpassword
    depends_on:
      - postgresql

  redis:
    image: redis:latest
    command: redis-server --requirepass redisPassword
    ports:
      - "6379:6379"
  
  chatroom_list:
    image: redis:latest
    command: redis-server --requirepass redisPassword
    ports:
      - "6380:6380"

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
  
  main_server:
    build: ./myapp
    ports:
      - "8080:8080"
    depends_on:
      - postgresql
      - redis
      - mongodb
    environment:
      - REDIS_ADDR=redis:6379
      - REDIS_PASSWORD=redisPassword
      - DB_URL=postgres://postgres:rootpassword@postgresql:5432/postgres?sslmode=disable
      - MONGO_URL=mongodb://mongodb:27017  

  test:
    build: 
      context: ./myapp
      dockerfile: Dockerfile.test
    depends_on:
      - main_server
      - postgresql
      - redis
      - mongodb
      - db_init
    environment:
      - REDIS_ADDR=redis:6379
      - REDIS_PASSWORD=redisPassword
      - DB_URL=postgres://postgres:rootpassword@postgresql:5432/postgres?sslmode=disable
      - MONGO_URL=mongodb://mongodb:27017


volumes:
  postgresql_data:
  mongodb_data:
```

- **문제**
  - 기존의 테스트 방식은 자동화 돼있지 않았음.
    - 테스트의 오류가 발생시 로직 상의 문제인지, 환경의 문제인지 판단하기 어려웠음
    - 테스트를 까먹는 경우가 발생함
    - 새로운 환경에서 테스트를 진행할 때 환경 구축에 시간이 소요됨

- **해결**
  - docker-compose를 통한 테스트 환경 구축
    - 테스트 환경을 [docker-compose](https://github.com/kaestro/ChatApplication/blob/main/docker-compose.yml)로 구축한다
      - db_init, wait-for-it, wait-for-postgres 등의 서비스를 추가
    - 테스트 환경을 구축하는 과정을 자동화하여 테스트 환경을 쉽게 구축할 수 있게 함

빌드를 할 경우에, 단순 빌드 뿐 아니라 내부 테스트를 진행하고 오류의 여부에 대해 시스템적으로 확인할 수 있게 됐다. 이를 통해 테스트를 까먹는 경우를 방지하고, 테스트 환경을 구축할 필요가 없어진다. 이를 통해 테스트를 자주 진행할 수 있게 되었고, 테스트를 통해 코드의 신뢰성을 확보할 수 있게 되었다.

#### github actions

```yml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Go
      uses: actions/setup-go@v2
      with:
        go-version: 1.22

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Build and Test with docker-compose
      run: |
        docker-compose run --rm test
        docker-compose logs test > test.log
        echo "exit_code=$?" >> $GITHUB_ENV
        docker-compose down

    - name: Upload test log
      uses: actions/upload-artifact@v2
      with:
        name: test-log
        path: test.log

    - name: Exit with code
      run: exit ${{ env.exit_code }}
```

- **문제**
  - 테스트 결과를 확인하기 위해 로컬에서 테스트를 진행해야 함
  - 여러 독립적인 모듈을 리모트한 환경에서 테스트하는 것이 불가능해 이를 수동으로 진행해야 함
  - 테스트가 다른 모듈이 준비가 완료되기 전에 진행되거나, table이 없는 상태에서 테스트가 진행되는 등의 문제가 발생함
  - github actions 테스트 결과를 확인할 방법이 없었음

- **해결**
  - github actions를 통한 테스트 자동화
  - db_init, wait-for-it, wait-for-postgres 등을 통한 테스트 환경이 remote에서도 구축됨
  - upload-artifact를 통해 테스트 결과를 확인할 수 있음

여러 모듈을 독립적으로 개발한 뒤 통합하는 과정에서 테스트를 자동화 하는 시스템을 구축했다. 또한 docker 내에서 여러 서비스 간의 의존성을 해결하는 방법을 배웠다.
