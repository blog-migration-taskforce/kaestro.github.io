---
layout: series
series: Chat Application 개발일지
seriesIndex: 3
classes: wide
title: "ChatApplication Review(3)"
subtitle: "팀원 모집, 확장성 높은 디자인, CI/CD"
date: 2024-03-06
categories: "개발일지"
---


## 목차

1. 느낀 점
2. 진행 내용
3. 문제 및 해결 방법

---

## 느낀 점

---

## 진행 내용

* 추가 진행에서 협업할 인원 모집
* 채팅 기능을 위한 모듈들의 작성
* 설계 조건 맞추기 위한 이론적인 구상
* 협업을 위한 환경 설정

---

## 문제 및 해결 방법

### 문제 요구 스펙 관련해서 Redis와 같은 세션을 여러개 사용해야할 가능성이 높다는 것을 확인

* RedisStore가 고정적으로 하나의 Redis와의 연결만을 생성할 수 있었음.

### 해결 방법

* StoreFactory를 만들고, RedisStoreFactory를 분리.
* RedisStoreFactory가 추후에 여러가지 Redis연결을 생성하는 것이 용이하도록 구성함.

```go
type RedisStoreFactory struct{}

func (factory *RedisStoreFactory) Create(sessionTypeNum SessionType) SessionStore {
	var store SessionStore
	if sessionTypeNum == LoginSession {
		redisAddr := os.Getenv("REDIS_ADDR")
		if redisAddr == "" {
			redisAddr = "localhost:6379" // default value
		}

		store = &RedisStore{
			client: redis.NewClient(&redis.Options{
				Addr:     redisAddr,
				Password: "redisPassword", // no password set
				DB:       0,               // use default DB
			}),
		}
	} else if sessionTypeNum == OtherSession {
		panic("Unauthorized session type number given to RedisStoreFactory.")
	}
	return store
}
```

---

### 문제: 여러가지 측면에서 다른 사람의 도움이 있으면 속도가 빨라질 것 같다는 생각이 듬

1. 설계적인 측면에서 second opinion이 필요함.
2. 코드 리뷰를 통해 유지보수성을 높일 필요가 있음.
3. 작성해야하는 코드의 양이 많아짐.

### 해결 방법

- 커뮤니티에 모집글을 게시
- 연락이 온 사람과 화상 미팅 진행
  - 2명 모집.
  - 일주일간 진행해보고 계속할 지 여부에 대해 결정하기로 함.


---

### 문제: 협업을 위한 환경 설정

1. 브랜치를 관리하기 위한 규칙이 필요
2. ci를 위한 설정이 필요


### 해결 방법

1. 브랜치 관리 규칙을 정함
	* main: 배포용 브랜치
    	* push 불가능
	* pull request 규칙 설정
		* 승인을 받아야만 merge 가능
		* 코드 소유자의 리뷰가 필요
2. github action을 통해 ci를 설정함
	* go 프로젝트 빌드/테스트가 성공해야만 merge 가능
		* [TODO] 기존의 테스트 코드들이 mock을 사용하지 않아서 테스트가 불가능한 상황 해소 필요
	* docker 빌드가 성공해야만 merge 가능

```yaml
name: CI

on:
  pull_request:
    branches: [ main ]

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

    - name: Dockerfile main_server 빌드
      run: docker build -t main_server:latest .
      working-directory: myapp

    - name: Build with docker-compose
      run: docker-compose up -d
      working-directory: myapp

    - name: Test
      run: go test ./...
      working-directory: myapp

    - name: Build
      run: go build ./...
      working-directory: myapp
```

---

### 문제: azure에 컨테이너를 통한 배포

* 컨테이너에 앞서 이에 포함된 main_server를 acr(azure container registry)에 올리는 과정에서 문제가 발생함.
  * [Docker를 통한 어플리케이션 생성 wiki](https://github.com/kaestro/ChatApplication/wiki/Docker%EB%A5%BC-%ED%86%B5%ED%95%9C-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%EC%83%9D%EC%84%B1)
  * [Azure Container Registry](https://github.com/kaestro/ChatApplication/wiki/Azure-Container-Registry)

### 해결 방법

* 기존에 acr의 이름이 너무 길어서 camelCase를 사용했던 것이 문제였음. docker는 push할 때 대/소문자가 있을 경우 인증 오류를 발생시킬 수 있음.
* [공식문서](https://learn.microsoft.com/ko-kr/azure/container-registry/container-registry-faq#az-acr-login-succeeds-but-docker-fails-with-error--unauthorized--authentication-required)
* 기존의 purmirContainerRegistry를 purmir로 변경함.

---

### Kubernetes를 통한 배포

### 문제: kubernetes로 로컬에 클러스터를 생성한 상태에서 요청이 이루어지지 않고 있음.

### 해결 방법

* log를 일단 읽어야 문제 해결이 가능할 것 같음.
* kubernetes에 대한 이해 필요
* 혹은 kubernetes 이외의 방법을 통한 배포를 고려해야할 수도 있음.