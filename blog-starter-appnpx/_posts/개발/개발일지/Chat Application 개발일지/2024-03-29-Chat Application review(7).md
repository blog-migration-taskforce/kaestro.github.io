---
layout: series
series: Chat Application 개발일지
seriesIndex: 7
classes: wide
title: "ChatApplication Review(7)"
subtitle: "사양이 불명확할 때의 구현, 추상화를 통한 역할 분리"
date: 2024-04-09
categories: "개발일지"
---

## 목차

- [목차](#목차)
- [느낀 점](#느낀-점)
- [진행 내용](#진행-내용)
- [진행 과정](#진행-과정)
  - [Chat 모듈 구현](#chat-모듈-구현)
    - [모듈 사양이 불명확할 때의 구현](#모듈-사양이-불명확할-때의-구현)
      - [clientManager.go](#clientmanagergo)
    - [추상화를 통해 모듈의 작업 단위를 세부적으로 분리](#추상화를-통해-모듈의-작업-단위를-세부적으로-분리)
      - [room.go](#roomgo)
      - [roomManager.go](#roommanagergo)
    - [이후 진행 방향](#이후-진행-방향)

---

## 느낀 점

1. 협업에서 모듈의 사양 합의가 돼있지 않을 때, 이에 대응하기 용이한 유연한 코드를 작성하는 방법
2. MVP 내에서도 더 세부 단계에서 어디서부터 구현을 시작해야 하는지에 대한 고민
3. 추상화를 통해 모듈 내부의 역할을 세부적으로 분리하는 방법
4. Interface 등의 더 상위 추상화를 통해 모듈 간의 의존성을 줄이는 작업 검토의 필요성

---

## 진행 내용

- Chat 모듈 구현

---

## 진행 과정

### Chat 모듈 구현

#### 모듈 사양이 불명확할 때의 구현

- **문제**
  - 다른 팀원과 모듈의 사양에 대해 합의가 돼있지 않다
  - 내가 작성한 chat 모듈을 다른 팀원이 사용할 때 어떤 형태로 부를 것인지 불명확하다
  - 내가 chat 모듈에서 이용해야하는 다른 모듈의 형태가 불명확하다

- **해결**
  - 코드를 가능한 작은 단위로 나누어 유연한 변경이 가능하도록 한다
  - 함수에서 파라미터로 받는 값을 특정한 형태로 제한하고, 이를 활용하는 상위 모듈을 작성한다
  - 상위 모듈에서는 추후에 다른 모듈에서 이를 호출할 때 필요한 값을 제한한다.

##### clientManager.go

```go
func (cm *ClientManager) CheckClient(sessionID string) bool {
  _, ok := cm.clients[sessionID]
  return ok
}

func (cm *ClientManager) GetClient(sessionID string) *Client {
  if !cm.CheckClient(sessionID) {
    fmt.Println("Client with sessionID", sessionID, "does not exist")
    return nil
  }

  return cm.clients[sessionID]
}
```

#### 추상화를 통해 모듈의 작업 단위를 세부적으로 분리

- **문제**
  - 단일 클래스들이 하는 역할이 너무 많아 코드가 복잡해졌다.
    - 기존에는 client, room, socket이라는 세 개의 클래스를 통해 구현을 작업하려 했음.
  - 각각의 클래스가 하는 일들이 무엇인지 구분하기 어려웠다.
    - room, client는 방에 client를 추가하고 이들을 관리하는 작업들을 동시에 했다.
  - 클래스 간에 하는 영역이 겹치는 부분이 많아 코드 중복이 발생했다.

- **해결**
  - 클래스가 할 일을 더 작은 단위로 나누어 추상화한다.
    - [room](https://github.com/kaestro/ChatApplication/blob/4-chat-%EB%AA%A8%EB%93%88-%EC%9E%91%EC%84%B1/myapp/internal/chat/room.go)
      - 방을 crud하는 메소드를 제공한다.
      - 방에 들어온 client의 crud를 관리한다.
      - 방에 들어온 client들 간의 메시지를 주고 받는 작업을 한다.
  - 이 과정에서 사라진 이들을 관리하는 작업을 Manager 클래스로 분리한다.
    - ClientManager, RoomManager, ChatManager 등으로 분리한다.
    - [ChatManager](https://github.com/kaestro/ChatApplication/blob/4-chat-%EB%AA%A8%EB%93%88-%EC%9E%91%EC%84%B1/myapp/internal/chat/chatManager.go)는 최상위 클래스로, RoomManager, ClientManager를 통해 채팅 전반을 관리한다.

##### room.go

```go
func NewRoom() *Room {
  room := &Room{
    client_chan: make(map[*Client]*websocket.Conn),
    broadcast:   make(chan []byte),
    register:    make(chan *ClientConn),
    unregister:  make(chan *ClientConn),
  }

  go room.run()

  return room
}
```

##### roomManager.go

```go
type RoomManager struct {
  rooms map[string]*Room
}

func GetRoomManager() *RoomManager {
  roomOnce.Do(func() {
    roomManager = &RoomManager{
      rooms: make(map[string]*Room),
    }
  })

  return roomManager
}

func (rm *RoomManager) CheckRoom(roomID string) bool {
  _, ok := rm.rooms[roomID]
  return ok
}

func (rm *RoomManager) GetRoom(roomID string) *Room {
  if !rm.CheckRoom(roomID) {
    fmt.Println("Room with roomID", roomID, "does not exist")
    return nil
  }

  return rm.rooms[roomID]
}
```

#### 이후 진행 방향

1. 현재 작성중인 포멧의 추가 구현
2. Interface 등의 더 상위 추상화를 통해 모듈 간의 의존성을 줄이는 작업 필요성 검토
