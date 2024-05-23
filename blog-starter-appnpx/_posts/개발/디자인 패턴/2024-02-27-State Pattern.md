---
layout: default
classes: wide
title: "상태 패턴"
subtitle: "이 기계는 당첨일수도, 아닐수도 있습니다."
date: 2024-02-27
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 상태 패턴을 사용한 해결책
5. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**상태 패턴**은 객체의 **상태**에 따라 객체의 **행동**을 **변경**할 수 있게 하는 패턴입니다. 이는 객체의 상태를 클래스로 표현해서 **추상화**하고, 상태 객체의 동작을 통해 조작하고자 하는 객체가 **자동으로 행동**을 **변경**할 수 있도록 합니다.

상태 패턴을 사용하면 객체의 관점에서는 동일한 동작을 하지만, 내부적으로는 상태에 따라 다른 동작을 하도록 할 수 있습니다. 이는 마치 객체의 **클래스가 바뀌는 것**과 같은 효과를 가져옵니다.

head first design patterns는 **동전 투입기**를 예시로 들어 상태 패턴을 설명합니다. 동전 투입기는 **동전 없음**, **동전 있음**, **동전 투입됨**과 같은 여러 가지 **조건**에 따라 동작을 달리합니다. 이것들을 **내부 변수**의 값을 통해 **조건문**으로 처리하려 할 경우 코드가 복잡해지고, 새로운 상태가 추가될 때마다 코드를 수정해야 합니다.

이런 상황에서 **상태 패턴**을 사용하면 각각의 **상태**를 클래스로 **캡슐화**해서 나중에 변경해야 하는 내용을 국지화할 수 있습니다. 이를 통해 상태에 따라 객체가 알아서 행동을 바꿀 수 있도록 할 수 있습니다. 이는 마치 매 순간 동전 투입기가 **새로운 물건**으로 변신하는 것과 같은 효과를 가져옵니다.

상태 전환은 State 클래스로 제어할 수도 있고, Context 클래스로 제어할 수도 있습니다.

---

## 요약

1. **상태 패턴**은 객체의 **상태**에 따라 객체의 **행동**을 **변경**할 수 있게 하는 패턴입니다.
2. 객체의 상태를 **클래스로 표현**하고, **내부 상태**에 따라 객체의 행동을 **알아서** 바꿀 수 있게 합니다.
3. 상태 전환은 **State 클래스**로 제어할 수도 있고, **Context 클래스**로 제어할 수도 있습니다.
4. Gumball Machine - Context, State - 동전 없음, 동전 있음, 동전 투입됨

---

## 문제상황

동전을 투입하고 손잡이를 돌리면 알맹이가 나오는 껌볼 기계를 만들어 달라는 요청이 들어왔습니다. 이를 구현하기 위해서는 매 입력이 들어온 순간마다 해당 기계가 동전이 있는지, 손잡이를 돌렸는지, 알맹이가 있는지 정보를 가지고 있어야 합니다.

이 정보들을 기존의 변수로 처리하려고 하면 코드가 복잡해지고, 새로운 상태가 추가될 때마다 코드를 수정해야 합니다.

이를 코드로 나타내면 다음과 같습니다.

```java
public class GumballMachine {
    final static int SOLD_OUT = 0;
    final static int NO_QUARTER = 1;
    final static int HAS_QUARTER = 2;
    final static int SOLD = 3;

    int state = SOLD_OUT;

    public GumballMachine(int count) {
        this.count = count;
        if (count > 0) {
            state = NO_QUARTER;
        }
    }

    public void insertQuarter() {
        if (state == HAS_QUARTER) {
            System.out.println("동전은 한 개만 넣어주세요.");
        } else if (state == NO_QUARTER) {
            state = HAS_QUARTER;
            System.out.println("동전을 넣으셨습니다.");
        } else if (state == SOLD_OUT) {
            System.out.println("매진되었습니다.");
        } else if (state == SOLD) {
            System.out.println("잠깐만 기다려 주세요. 알맹이가 나가고 있습니다.");
        }
    }

    // ejectQuarter, turnCrank, dispense 메소드도 비슷한 방식으로 구현됩니다.
}
```

이처럼 해당 객체가 동작할 때마다 사용할 메소드들은 모든 변수들에 대해 **분기문**을 처리해야하기 때문에 가독성이 떨어지고, **새로운 명령이나 변수**가 추가될 때마다 코드를 수정해야 하기 때문에 유지보수가 어렵습니다.

만약 예를 들어 동전을 돌리는 순간에 10분의 1 확률로 두 개의 알맹이가 나오는 기능을 추가하고 싶다면 어떻게 해야할까요? 이를 위해서는 수많은 경우의 수를 고려해서 코드를 수정해야 합니다.

---

## 상태 패턴을 사용한 해결책

문제를 반대로 생각해서 메소드가 실행될 때마다 모든 상태를 분기문을 통해 확인하는 것이 아니라, **객체의 상태**를 **변경**하고 해당 상태에 따라 객체의 **행동이 정해진다**면 어떨까요? 그것이 바로 **상태 패턴**입니다.

상태별 행동을 별도의 클래스에 넣어 두고 모든 상태에서 각각 자기가 할 일을 구현하도록 한 뒤, 이들을 **통합하는 인터페이스**를 제공하는 것을 통해 상태 패턴을 구현할 수 있습니다.

이를 코드로 나타내면 다음과 같습니다.

```java
public interface State {
    public void insertQuarter();
    public void ejectQuarter();
    public void turnCrank();
    public void dispense();
}

public class NoQuarterState implements State {
    GumballMachine gumballMachine;

    public NoQuarterState(GumballMachine gumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    public void insertQuarter() {
        System.out.println("동전을 넣으셨습니다.");
        gumballMachine.setState(gumballMachine.getHasQuarterState());
    }

    public void ejectQuarter() {
        System.out.println("동전을 넣어주세요.");
    }

    // turnCrank, dispense 메소드도 비슷한 방식으로 구현됩니다.
}

// HasQuarterState, SoldState, SoldOutState 클래스도 비슷한 방식으로 구현됩니다.
```

이렇게 구현한 상태 패턴을 통해 GumballMachine 클래스를 새로 구현하면 다음과 같습니다.

```java
public class GumballMachine {
    State soldOutState;
    State noQuarterState;
    State hasQuarterState;
    State soldState;

    State state = soldOutState;
    int count = 0;

    public GumballMachine(int count) {
        soldOutState = new SoldOutState(this);
        noQuarterState = new NoQuarterState(this);
        hasQuarterState = new HasQuarterState(this);
        soldState = new SoldState(this);

        this.count = count;
        if (count > 0) {
            state = noQuarterState;
        }
    }

    public void insertQuarter() {
        state.insertQuarter();
    }

    public void ejectQuarter() {
        state.ejectQuarter();
    }

    public void turnCrank() {
        state.turnCrank();
        state.dispense();
    }

    public void setState(State state) {
        this.state = state;
    }

    public void releaseBall() {
        System.out.println("알맹이가 나가고 있습니다.");
        if (count != 0) {
            count = count - 1;
        }
    }

    // getCount, refill 메소드도 비슷한 방식으로 구현됩니다.
}
```

이제 각각의 상태에 대해 별도의 **클래스**로 **캡슐화**했기 때문에, Gumball은 현재 상태에 따로 인지할 필요 없이 인터페이스를 이용만 하면 됩니다. 이에 따른 **동작**은 각각의 **상태 클래스에서 정의**되어 있기 때문입니다.

이는 추가적으로 상태를 추가하거나, 상태의 행동을 변경할 때에도 해당 상태 클래스만 수정하면 되기 때문에 유지보수가 용이합니다.

---

## 결론

**상태 패턴**은 객체의 **상태에 따라 객체의 행동을 변경**할 수 있게 하는 패턴입니다. 이는 객체의 **상태를 클래스로 표현**하고, 상태에 따라 **객체의 행동이 자동으로 결정**되도록 합니다. 이는 마치 객체의 클래스가 바뀌는 것과 같은 효과를 가져옵니다.

상태 패턴을 통해 객체의 상태를 context가 아닌 **상태 클래스에서 관리**함으로써, context는 상태에 대해 알 필요 없이 **인터페이스를 통해 행동을 결정**할 수 있게 됩니다. 이는 유지보수가 용이하고, 새로운 상태를 추가하거나 상태의 행동을 변경할 때에도 해당 상태 클래스만 수정하면 되기 때문에 **유연한 코드**를 작성할 수 있게 됩니다.
