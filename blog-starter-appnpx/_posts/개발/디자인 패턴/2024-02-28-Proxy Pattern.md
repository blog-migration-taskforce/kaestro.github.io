---
layout: default
classes: wide
title: "프록시 패턴"
subtitle: "당신이 나의 대리인인가"
date: 2024-02-28
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 프록시 패턴을 사용한 해결책
5. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**프록시 패턴**은 특정 객체로의 **접근을 제어하는 대리인**을 제공하는 패턴입니다. 이는 객체의 접근을 제어함으로써 **보안**이 중요한 객체에 대한 접근을 제어하거나, **원격 객체**에 대한 접근을 제어하거나, 객체 생성 비용을 줄이기 위해 **객체를 생성하는 시점을 미루는** 등의 목적으로 사용할 수 있습니다.

프록시 패턴은 **대리자**와 **실제 객체**를 나누어서 사용합니다. 이는 클라이언트가 실제 객체에 직접 접근하는 것이 아니라, 대리자를 통해 접근하도록 합니다. 클라이언트는 대리자를 통해 실제 객체에 접근하지만, 클라이언트는 이를 모르고 대리자를 실제 객체로 착각합니다.

head first design patterns는 **원격에서 제어**하는 **Gumball Machine**을 예시로 들어 프록시 패턴을 설명합니다. 원격에서 제어하는 Gumball Machine은 **GumballMonitor**라는 **프록시**를 통해 접근합니다. 이를 통해 뽑기 회사는 원격에서 기계별 상태를 확인할 수 있습니다.

자바에서는 프록시 패턴을 지원하기 위한 유용한 라이브러리를 다양하게 제공합니다.

---

## 요약

1. **프록시 패턴**은 특정 객체로의 접근을 제어하는 **대리인**을 제공하는 패턴입니다.
2. 프록시 패턴은 **대리자**와 **실제 객체**를 나누어서 사용합니다.
3. 클라이언트는 대리자를 통해 실제 객체에 접근하지만, 클라이언트는 이를 모르고 대리자를 실제 객체로 **착각**합니다.
4. 프록시 패턴은 **보안**이 중요한 객체에 대한 접근을 제어하는데 사용할 수 있습니다.
5. **원격 객체**에 대한 접근을 제어하는데 사용할 수 있습니다.
6. 객체 **생성 비용**을 줄이기 위해 객체를 **생성하는 시점을 미루는 목적**으로 사용할 수 있습니다.
7. Gumball Machine - 실제 객체, GumballMonitor - 프록시

---

## 문제상황

기존 Gumball Machine을 요청한 회사에서 **원격**으로 기계별 **상태를 파악**하고 싶다는 요청을 보냈습니다. 이를 구현하기 위해서 기존의 Gumball Machine에 대한 접근을 제어하는 GumballMonitor 클래스를 만들 수 있습니다.

이를 코드로 나타내면 다음과 같습니다.

```java
public class GumballMachine {
    int count;
    String location;

    public GumballMachine(String location, int count) {
        this.location = location;
        this.count = count;
    }

    public int getCount() {
        return count;
    }

    public String getLocation() {
        return location;
    }
}

public class GumballMonitor {
    GumballMachine machine;

    public GumballMonitor(GumballMachine machine) {
        this.machine = machine;
    }

    public void report() {
        System.out.println("Gumball Machine: " + machine.getLocation());
        System.out.println("Gumball Inventory: " + machine.getCount());
    }
}
```

그런데 이처럼 코드를 만들기 전에 요구 사항을 확실히 파악하는 것은 불가능에 가깝습니다. 이런 상황에서 모니터링을 기존의 코드를 수정하지 않고 추가하려면 어떻게 해야 할까요?

---

## 프록시 패턴을 사용한 해결책

프록시 패턴을 사용하면 기존의 코드를 수정하지 않고도 모니터링을 추가할 수 있습니다. 프록시 패턴은 GumballMonitor 클래스는 그대로 두고, 원격에서 제어하는 Gumball Machine에 대한 **접근을 제어하는 프록시**를 만들어서 Gumball Machine을 제어할 수 있게 합니다.

프록시는 진짜 객체를 **대신**하는 역할을 합니다. 이는 클라이언트가 진짜 객체에 직접 접근하는 것이 아니라, 프록시를 통해 접근하도록 합니다. 클라이언트는 프록시를 통해 진짜 객체에 접근하지만, 클라이언트는 이를 모르고 프록시를 진짜 객체로 착각합니다.

클라이언트 객체는 원격 객체의 메소드 호출을 하는 것으로 착각하지만, 실제로는 프록시 객체의 메소드 호출을 하는 것입니다. 네트워크 통신과 같은 복잡한 작업은 프록시 객체가 처리해 줍니다.

이런 프록시 보조 객체는 클라이언트 뿐 아니라 서버 쪽에서도 사용할 수 있습니다. 두 객체는 각자의 위치에서 받은 요청을 처리하고, 서로 통신을 하면서 진짜 서비스에서 클라이언트의 요청을 처리해줍니다.

이를 java.rmi 패키지를 사용해서 구현하면 다음과 같습니다.

```java
import java.rmi.*;

public interface GumballMachineRemote extends Remote {
    public int getCount() throws RemoteException;
    public String getLocation() throws RemoteException;
    public State getState() throws RemoteException;
}
```

```java
import java.io.*;

public interface State extends Serializable {
    public void insertQuarter();
    public void ejectQuarter();
    public void turnCrank();
    public void dispense();
}

public class NoQuarterState implements State {
    public static final long serialVersionUID = 2L;
    transient GumballMachine gumballMachine;
    // 기타 메소드
}
```

```java
import java.rmi.*;

public class GumballMachine implements GumballMachineRemote {
    int count;
    String location;
    State state;

    public GumballMachine(String location, int count) {
        this.location = location;
        this.count = count;
    }

    public int getCount() {
        return count;
    }

    public String getLocation() {
        return location;
    }

    public State getState() {
        return state;
    }
}
```
이외에 rmi 레지스트리에 등록하는 등의 작업은 생략하겠습니다.

---

## 결론

**프록시 패턴**은 특정 객체로의 접근을 제어하는 **대리인**을 제공하는 패턴입니다. 이는 객체의 **접근을 제어**함으로써 **보안**이 중요한 객체에 대한 접근을 제어하거나, **원격 객체**에 대한 접근을 제어하거나, **객체 생성 비용**을 줄이기 위해 객체를 생성하는 시점을 미루는 등의 목적으로 사용할 수 있습니다.

프록시 패턴은 **대리자**와 **실제 객체**를 나누어서 사용합니다. 이는 클라이언트가 실제 객체에 직접 접근하는 것이 아니라, 대리자를 통해 접근하도록 합니다. 클라이언트는 대리자를 통해 실제 객체에 접근하지만, 클라이언트는 이를 모르고 대리자를 실제 객체로 착각합니다.

head first design patterns는 원격에서 제어하는 Gumball Machine을 예시로 들어 프록시 패턴을 설명합니다. 원격에서 제어하는 Gumball Machine은 GumballMonitor라는 프록시를 통해 접근합니다. 이를 통해 뽑기 회사는 원격에서 기계별 상태를 확인할 수 있습니다.

다만 프록시 패턴은 원격에서 제어하는 것 외에도 다양한 객체의 **접근 방식을 제한**하는데 사용할 수 있습니다. 이 부분을 각자의 요구와 개발 환경에 맞게 사용하는 것이 중요하다 할 수 있을 것입니다.