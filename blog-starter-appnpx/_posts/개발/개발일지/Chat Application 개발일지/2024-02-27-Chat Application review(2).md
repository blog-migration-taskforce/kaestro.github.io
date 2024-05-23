---
layout: series
series: Chat Application 개발일지
seriesIndex: 2
classes: wide
title: "ChatApplication Review(2)"
subtitle: "컨테이너화, ChatDBManager"
date: 2024-02-27
categories: "개발일지"
---


## 목차

1. 느낀 점
2. 진행 내용
3. 문제 및 해결 방법


---


## 느낀 점


단순히 프로그램이 동작하는 것을 넘어서, 오랜 기간동안 개발 및 유지될 것을 고려하면 많은 부분이 달라진다는 것을 경험할 수 있었다. unittest들이 작성돼있었던 덕분에 sessionManager 같은 것들을 refactor했는데도 동작이 여전히 가능하단 것을 쉽게 확인할 수 있었지만, 동시에 이를 자동화하기 위한 방법도 고려해 둬야한다는 것도 알 수 있었다.

또한 이후 개발에 있어서 현재 예측할 수 없는 스펙 부분에 대응하기 위해 가능한 많은 부분을 유연하게 만들어두는 것이 중요하다는 것도 알 수 있었다. 내가 현재 생각해 둔 디렉토리의 형태부터 시작해서 변수/파일명, 인터페이스 접근 방식 등 생각보다 훨씬 많은 것들에 대해 유연하게 대응할 수 있도록 만들어둘 수 있는 부분이 많았다.

그리고 containerization이 끝났다 해서 이를 remote cloud server에 올리는 것이 단순하지만은 않다는 것도 느낀다.

---


## 진행 내용

* 배포를 위한 containerization 작업 완료
* 채팅 기능을 위한 모듈들의 기본적인 구조 설계 및 이에 따른 구조 refactoring
* 채팅에서 사용할 mongodb 인터페이스 설계

---

## 문제 및 해결 방법

### 문제: 빌드한 어플리케이션이 로컬에서와 다르게 동작함
  1. postgresql과의 연결이 안됨
     * 기존에 hostname이 localhost로 돼있었는데, containerization을 할 경우 이를 postgresql로 DBManager를 바꿔야하기 때문.
     * 로컬에서 테스트할 경우에 문제가 되는 부분이기 때문에 이를 양쪽 환경에서 다르게 쓸 방법을 찾아야함.
  2. Failed to process session key 에러가 발생하고 있음.
	 * 이는 로컬에서는 발생하지 않았던 에러로, 이를 해결하기 위해선 어떤 부분이 문제인지 파악해야함.
	 * 이를 위해선 로컬에서와 동일한 환경을 만들어야함.
	 * postgresql과 마찬가지로 hostname을 localhost를 쓰던 것이 문제였고, 이를 redis로 바꿔야함.
   
### 해결 방법:
  * ENV를 사용하여 환경변수를 설정하고, 없을 경우에는 default인 localhost를 사용하게 해서 local에서 동작하도록 변경함.
  * 해당 ENV는 docker-compose.yml와 dockerfile에서 사용하도록 변경함.
   * [https://github.com/kaestro/ChatApplication/commit/e6258879d661345d7aeeac0a05ed953e8bd05a0e](https://github.com/kaestro/ChatApplication/commit/e6258879d661345d7aeeac0a05ed953e8bd05a0e)
  * ex)

    * before)
```go
func GetDBManager() *DBManager {
	once.Do(func() {
		var err error
		db, err := gorm.Open("postgres", "postgres://postgres:rootpassword@postgresql:5432/postgres?sslmode=disable")
		if err != nil {
			panic(err)
		}
```

	* after)
```go
func GetDBManager() *DBManager {
	once.Do(func() {
		var err error
		dbURL := os.Getenv("DB_URL")
		if dbURL == "" {
			dbURL = "postgres://postgres:rootpassword@localhost:5432/postgres?sslmode=disable" // default value
		}
		db, err := gorm.Open("postgres", dbURL)
		if err != nil {
			panic(err)
		}
```

---

### 문제: 몽고 db의 인터페이스 설정

1. 허용하고자 하는 동작은 어느 것들이 있는가
2. 기존의 디렉토리와 함께했을 때 구성은 어떻게 해야하는가
  * models같은 경우에는 api/models 디렉토리 상에 위치하고 있는데, 이를 몽고 db의 internal에서도 사용해야하는 시점에서 디렉토리 구성을 개선할 필요가 발생함.

### 해결 방법:

1. 일단 나머지 모듈들을 만들어서 테스트하는 데에 필요한 AddMessage, GetMessages, CreateChatRoom, GetChatRooms 정도의 함수를 만든다.
2. internal/db/mongodb 디렉토리를 만들고 여기에 ChatDBManager.go를 만들어 몽고 db들 중 chat에 한정한 인터페이스로 이번에 작성한 모듈이 국한되도록 한다.