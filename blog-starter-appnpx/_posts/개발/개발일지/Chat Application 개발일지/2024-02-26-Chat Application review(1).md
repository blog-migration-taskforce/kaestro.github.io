---
layout: series
series: Chat Application 개발일지
seriesIndex: 1
classes: wide
title: "ChatApplication Review(1)"
subtitle: "Login API, DBManager, SessionManager"
date: 2024-02-26
categories: "개발일지"
---


## 목차

1. 느낀 점
2. 진행 내용
3. 문제 및 해결 방법


---


## 느낀 점

개발할 때 최초에 생각한 것과 별개로 기능 추가 및 변경이 빈번하게 발생하게 된다. 이 때마다 기존의 코드를 변경하기 용이하게 하기 위한 추상화, business logic 분리, unit test 등의 작업이 필요하다.

원래는 login api를 다루는 서버에서 채팅 역시도 다루게 될 것이라고 생각했다. 그런데 현재 서버 구조는 api를 다루는 형태로 되어 있으니 이를 api 전용 서버로 두고, 채팅을 다루는 서버는 따로 두는 것이 낫지 않을까? 라는 생각이 들었다.


---


## 진행 내용

* 프로젝트 개요, 구조, 기술 스택, 개발 환경 등 정리. => [프로젝트 개요](http://kaestro.github.io/%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80/2024/02/26/Chat-Application-%EA%B0%9C%EC%9A%94.html)
* 메인 서버 구조 설계
* User CRUD API 구현
* DBManager, SessionManager, PasswordManager internal package 구현

---

### 메인 서버 구조 설계

```
myapp
├── api
│   ├── handler
│   │   └── user
│   ├── models
│   └── service
│       └── user
├── internal
│   ├── db
│   ├── session
│   └── password
├── pkg
├── scripts
├── tests
└── main.go
```

* api: API 요청을 처리하는 패키지.
  * handler: API 요청을 처리하는 핸들러.
  * models: API 요청과 응답에 사용되는 모델.
  * service: API 요청을 처리하는 비즈니스 로직.
  * user: User API 요청을 처리하는 패키지.
* internal: 내부 패키지.
  * db: 데이터베이스 관련 패키지.
  * session: 세션 관리 패키지.
  * password: 비밀번호 관리 패키지.
* pkg: 외부에 공개되는 패키지.(미정)
* scripts: 스크립트 파일.
  * 현재 sql 파일을 실행하는 스크립트만 존재.
* tests: 테스트 파일.
  * go 서버의 unit test 파일만 존재.
  * 추후 요구하는 규모에 따라 테스트 환경을 구축할 예정.
* main.go: 프로그램의 진입점.

---

### User CRUD API 구현
: Login, Logout, Signup, deleteAccount API 구현.

**구현 내용**
* Login API
  * 로그인 요청을 처리하는 핸들러 구현.
  * 로그인 성공 시 세션을 생성하고, 세션 ID를 응답.
  * 로그인 실패 시 에러 메시지를 응답.
* Logout API
  * 로그아웃 요청을 처리하는 핸들러 구현.
  * 세션을 삭제.
* Signup API
  * 회원가입 요청을 처리하는 핸들러 구현.
  * 회원가입 실패 시 에러 메시지를 응답.
* deleteAccount API
  * 회원탈퇴 요청을 처리하는 핸들러 구현.
  * 로그인 세션을 통해 회원탈퇴.
  * 회원탈퇴 실패 시 에러 메시지를 응답.

[**구현 상세**](https://github.com/kaestro/ChatApplication/tree/main/myapp/api)

DBManager와 SessionManager를 통해 유저의 정보를 조회하고, 관리를 위한 로직을 수행.
PasswordManager를 통해 비밀번호를 암호화하여 저장하고, 비밀번호 검증을 수행.

user data model을 구현, 이를 orm 패키지를 사용하여 데이터베이스와 연동한다.

handler에 응답을 처리하는 로직을 구현한 뒤 login 같은 경우는 비즈니스 로직이 변경될 수 있으므로 service 패키지를 통해 자주 변경되는 부분을 분리하였다.

---

### DBManager, SessionManager, PasswordManager internal package 구현
: User CRUD API 구현 과정에서 필요한 패키지 구현

**구현 내용**

* DBManager
  * 데이터베이스와 연동하여 유저 정보를 조회, 추가, 삭제하는 로직을 수행.
  * orm 패키지를 사용하여 데이터베이스와 연동.
  * DB 연결 자체가 아니라, Manager에서 허용하는 로직만을 public하게 제공.
* SessionManager
  * 캐시 서버를 통해 세션을 관리.
  * 세션 생성, 조회, 삭제 로직을 수행.
  * 세션 연결 자체가 아니라, Manager에서 허용하는 로직만을 public하게 제공.
* PasswordManager
  * 비밀번호를 암호화하여 저장하고, 비밀번호 검증하는 로직을 수행
  
**구현 상세**

**DBManager**는 DB 연결을 gorm을 통해 생성하고, create, read by single field, read all table, update row, delete row 기능을 제공한다.

**SessionManager**는 redis를 통해 세션 키 생성, 세션 생성, 조회, 삭제, 정합성 확인 기능을 제공. => *TODO* 현재 <u>LoginSessionGenerator.go를 LoginSessionKeyGenerator.go로 파일명 변경한다</u>

**Store**라는 추상적인 인터페이스를 통해 session을 관리하고, 현재 이를 RedisStore를 통해 구현한다. 이는 추후에 다른 저장소를 사용할 때 변경이 용이하도록 하기 위해서이다.

**PasswordManager**는 bcrypt를 통해 비밀번호를 암호화하고, 비밀번호 검증하는 기능을 제공한다.

---

## 문제 및 해결 방법

### 문제상황

```
1. dbManager가 연결 객체 자체를 반환하고 있었음.
2. 암호화 로직이 api마다 중복되어 있었음.
3. login api는 비즈니스 로직이 계속 변경되고 있어 service 패키지를 통해 분리하고 싶었음.
4. user CRUD api를 매 빌드시마다 unit test를 통해 검증하고 싶었음.
```


### 해결 방법

**dbManager가 연결 객체 자체를 반환하고 있었음.**

**문제점**: GetDB() 함수를 통해 db 객체를 반환하고 있었다. 이는 db 객체를 직접 사용하게 되어, dbManager의 로직이 변경될 때마다 모든 곳에서 변경이 필요하게 된다.

```go
var (
	once sync.Once

	db *gorm.DB
)

func GetDB() *gorm.DB {
	once.Do(func() {
		var err error
		db, err = gorm.Open("postgres", "postgres://postgres:rootpassword@localhost:5432/postgres?sslmode=disable")
		if err != nil {
			panic(err)
		}
	})

	return db
}
```

**해결 방법**: dbManager에서 허용하는 로직만을 public하게 제공하도록 변경.

```go
type DBManager struct {
	db *gorm.DB
}

var (
	once sync.Once

	manager *DBManager
)

func GetDBManager() *DBManager {
	once.Do(func() {
		var err error
		db, err := gorm.Open("postgres", "postgres://postgres:rootpassword@localhost:5432/postgres?sslmode=disable")
		if err != nil {
			panic(err)
		}

		manager = &DBManager{
			db: db,
		}
	})

	return manager
}

func (m *DBManager) Create(value interface{}) error {
    return m.db.Create(value).Error
}
...
```


---


**암호화 로직이 api마다 중복되어 있었음.**

**문제점**: 비밀번호 암호화, 비밀번호 검증 로직이 user CRUD api마다 중복되어 있었음.

```go
func Signup(c *gin.Context) {
    ...

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

    ...
}
```

**해결 방법**: Password package를 생성하여 비밀번호 암호화, 비밀번호 검증 로직을 분리.

```go
package password

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
```

### login api는 비즈니스 로직이 계속 변경되고 있어 service 패키지를 통해 분리하고 싶었음.

**문제점**: login api의 비즈니스 로직이 변경될 때마다 handler에서 변경이 필요하게 됨.

```go
	db.GetDB().Create(&user)

	// 로그인 정보를 담은 요청 본문을 생성합니다.
	loginInfo := struct {
		EmailAddress string `json:"emailAddress"`
		Password     string `json:"password"`
	}{
		EmailAddress: "test@example.com",
		Password:     "password",
	}
	body, _ := json.Marshal(loginInfo)

	// 테스트를 위한 HTTP 요청을 생성합니다.
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	w := httptest.NewRecorder()

	// Gin 엔진을 생성하고 LogIn 핸들러를 등록합니다.
	r := gin.Default()
	r.POST("/login", userAPI.LogIn)

	// HTTP 요청을 처리합니다.
	r.ServeHTTP(w, req)

	// 응답 상태 코드가 200인지 확인합니다.
	assert.Equal(t, http.StatusOK, w.Code)

	// 잘못된 비밀번호로 로그인을 시도합니다.
	loginInfo.Password = "wrongpassword"
	body, _ = json.Marshal(loginInfo)
	req, _ = http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	w = httptest.NewRecorder()

	// HTTP 요청을 처리합니다.
	r.ServeHTTP(w, req)

	// 응답 상태 코드가 401인지 확인합니다.
	assert.Equal(t, http.StatusUnauthorized, w.Code)

	t.Log("Login test passed!")
}
```

구현 과정에서 DBManager, SessionManager, Password 등의 패키지를 추가하게 됐다. 이 과정에서 추상화, 접근 제어 등의 기능이 도입되었고 이 때마다 handler에서 변경이 필요하게 됨.

이와 관련한 해결 방법으로 service 패키지를 통해 비즈니스 로직을 분리하고자 함.

```go
var (
	ErrAlreadyLoggedIn            = errors.New("user is already logged in")
	ErrUserNotFound               = errors.New("failed to find user")
	ErrInvalidPassword            = errors.New("invalid password")
	ErrFailedToGenerateSessionKey = errors.New("failed to generate session key")
	ErrFailedToSaveSessionKey     = errors.New("failed to save session key")
)

type LoginService struct {
	dbManager      *db.DBManager
	sessionManager *session.SessionManager
}

func NewLoginService(dbManager *db.DBManager, sessionManager *session.SessionManager) *LoginService {
	return &LoginService{
		dbManager:      dbManager,
		sessionManager: sessionManager,
	}
}

func (s *LoginService) LogIn(userEmailAddress, userPassword, userSessionKey string) (string, error) {
	// 세션 키가 sessionManager에 저장되어 있는지 확인합니다.
	if s.sessionManager.IsSessionValid(userSessionKey, userEmailAddress) {
		return "", ErrAlreadyLoggedIn
	}

	// 사용자 정보를 담을 User 구조체를 선언합니다.
	var user models.User

	// 사용자가 제공한 이메일 주소로 데이터베이스에서 사용자를 찾습니다.
	err := s.dbManager.Read(&user, "email_address", userEmailAddress)
	if err != nil {
		return "", ErrUserNotFound
	}

	// 사용자가 제공한 비밀번호와 데이터베이스에 저장된 해시된 비밀번호를 비교합니다.
	if !password.CheckPasswordHash(userPassword, user.Password) {
		return "", ErrInvalidPassword
	}

	// 세션 키를 생성합니다.
	sessionKey, err := session.GenerateRandomSessionKey()
	if err != nil {
		return "", ErrFailedToGenerateSessionKey
	}

	// 세션 키를 캐시에 저장합니다.
	err = s.sessionManager.SetSession(sessionKey, user.EmailAddress)
	if err != nil {
		return "", ErrFailedToSaveSessionKey
	}

	return sessionKey, nil
}
```

---

### user CRUD api를 매 빌드시마다 unit test를 통해 검증하고 싶었음.

**문제점**: user CRUD api를 구현 때마다 postman을 통해 수동으로 테스트를 진행하고 있었음.

**해결 방법**: user CRUD api를 매 빌드시마다 검증할 unit test를 작성.

```go
func TestUserHandler(t *testing.T) {
	// 테스트를 위한 사용자 정보를 생성합니다.
	sampleUser := models.User{
		UserName:     "testuser",
		EmailAddress: "test@example.com",
		Password:     "password",
	}

	// Gin 엔진을 생성하고 핸들러들을 등록합니다.
	ginEngine := gin.Default()
	ginEngine.POST("/login", userAPI.LogIn)
	ginEngine.POST("/logout", userAPI.LogOut)
	ginEngine.POST("/signup", userAPI.SignUp)
	ginEngine.POST("/deleteAccount", userAPI.DeleteAccount)

	// signup HTTP 요청을 처리합니다.
	body, _ := json.Marshal(sampleUser)
	httpRequest, _ := http.NewRequest("POST", "/signup", bytes.NewBuffer(body))
	responseRecorder := httptest.NewRecorder()
	ginEngine.ServeHTTP(responseRecorder, httpRequest)

	t.Log(responseRecorder.Body.String())

	// 응답 상태 코드가 201인지 확인합니다.
	if assert.Equal(t, http.StatusCreated, responseRecorder.Code) {
		t.Log("SignUp 테스트 통과")
	}

	// login HTTP 요청을 처리합니다.
	loginInfo := struct {
		EmailAddress string `json:"emailAddress"`
		Password     string `json:"password"`
	}{
		EmailAddress: sampleUser.EmailAddress,
		Password:     sampleUser.Password,
	}
	body, _ = json.Marshal(loginInfo)
	httpRequest, _ = http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	responseRecorder = httptest.NewRecorder()
	ginEngine.ServeHTTP(responseRecorder, httpRequest)

	// 응답 상태 코드가 200인지 확인합니다.
	if assert.Equal(t, http.StatusOK, responseRecorder.Code) {
		t.Log("LogIn 테스트 통과")
	}

	// logout HTTP 요청을 처리합니다.
	httpRequest, _ = http.NewRequest("POST", "/logout", nil)
	httpRequest.Header.Set("Session-Key", responseRecorder.Body.String())
	responseRecorder = httptest.NewRecorder()
	ginEngine.ServeHTTP(responseRecorder, httpRequest)

	// 응답 상태 코드가 200인지 확인합니다.
	if assert.Equal(t, http.StatusOK, responseRecorder.Code) {
		t.Log("LogOut 테스트 통과")
	}

	// deleteAccount HTTP 요청을 처리합니다.
	body, _ = json.Marshal(loginInfo)
	httpRequest, _ = http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	responseRecorder = httptest.NewRecorder()
	ginEngine.ServeHTTP(responseRecorder, httpRequest)

	// 응답 상태 코드가 200인지 확인합니다.
	if assert.Equal(t, http.StatusOK, responseRecorder.Code) {
		t.Log("deleteAccount 전 LogIn 테스트 통과")
	}

	t.Log("Session-Key:" + responseRecorder.Body.String())
	var responseBody map[string]string
	json.Unmarshal(responseRecorder.Body.Bytes(), &responseBody)
	sessionKey := responseBody["sessionKey"]

	httpRequest, _ = http.NewRequest("POST", "/deleteAccount", nil)
	httpRequest.Header.Set("Session-Key", sessionKey)
	responseRecorder = httptest.NewRecorder()
	ginEngine.ServeHTTP(responseRecorder, httpRequest)

	// 응답 상태 코드가 200인지 확인합니다.
	if assert.Equal(t, http.StatusOK, responseRecorder.Code) {
		t.Log("deleteAccount 테스트 통과")
	}
}
```

---