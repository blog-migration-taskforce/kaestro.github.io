---
layout: default
classes: wide
title: "전략 패턴"
subtitle: "고무 오리는 날 수 없다, 엄마에게 혼났죠"
date: 2024-02-13
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. interface를 통한 해결의 문제점
5. 전략 패턴을 통한 해결
6. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**전략 패턴**은 **알고리즘**을 독립적인 객체로 **캡슐화**해서, 클라이언트와 **분리**하는 디자인 패턴입니다. 이를 통해 클라이언트는 알고리즘을 변경하지 않고도 다양한 알고리즘을 사용할 수 있습니다.

head first design patterns는 이에 대한 예시로 오리의 구현 기획이 변화하는 과정을 제시해서 설명합니다. 오리의 **꽥꽥** 소리를 낸다는 행동은 오리의 종류에 따라 다르게 구현될 수 있습니다. 또한 여기에 **날다**와 같은 기능을 추가하는 것이 요구될 수도 있습니다. 이를 구현하는 과정에서 생길 수 있는 많은 불편을 해소하기 위한 방법 중 하나가 **전략 패턴**입니다.

---

## 요약

* 전략 패턴은 알고리즘을 독립적인 객체로 캡슐화해서, 클라이언트와 분리하는 디자인 패턴입니다.
* 클라이언트 - 오리, 알고리즘 - 날다, 꽥꽥
* 상속이나 구현보다는 **구성**을 활용한다.

---

## 문제상황

기존에 수영하고, 소리만 낼 수 있는 오리가 구현돼고 있던 다음과 같은 프로그램이 있었습니다. 모든 오리들은 밖에 표현되는 방식만 다르게 구현돼 있습니다.

```java
public abstract class Duck {
    public void swim() {
        System.out.println("수영");
    }

    public void quack() {
        System.out.println("꽥꽥");
    }

    public abstract void display();
}

public class MallardDuck extends Duck {
    public void display() {
        System.out.println("MallardDuck");
    }
}

public class RedheadDuck extends Duck {
    public void display() {
        System.out.println("RedheadDuck");
    }
}

...

```

그런데 어느날, 오리에 날다 행동을 추가하라는 기획이 내려왔습니다. 그래서 당신은 다음과 같이 날다의 행동을 추가했습니다.

```java
public abstract class Duck {
    ...

    public void fly() {
        System.out.println("날다");
    }
}
```

그리고 대재앙을 맞이하게 됩니다. 이 오리 클래스를 상속하던 클래스 중에는 날아서는 안되는 rubberduck이 존재했던 것입니다. 이 노란빛 귀염둥이는 화면을 가득 수놓으며 우리를 괴롭히는 상황을 만들어냅니다.

이런 식으로, 상속을 통해 구현된 클래스들에 새로운 행동을 추가하거나, 기존 행동을 변경하는 것은 많은 예상불가능한 결과를 낳을 수 있기 때문에 어렵습니다.

---

## Interface를 통한 해결의 문제점

이 문제를 해결하기 위해 duck을 interface로 만들어서, 각각의 오리들이 이를 구현하도록 할 수 있습니다. 그런데, rubberduck과 같이 가끔 발생하는 예외가 있을 뿐 대부분의 경우에는 동일한 행동을 반복해서 사용하면 될 상황에서 interface를 사용하는 것은 매우 비효율적입니다.

```java
public interface Duck {
    public void swim();
    public void quack();
    public void display();
    public void fly();
}
```

위와 같은 Duck을 구현하는 수많은 클래스들에 대해 우리는 모두 4가지 메소드를 구현해야합니다. 그 뿐 아니라 이번에 fly를 추가해야했던 것과 같은 상황이 발생하면, Duck을 **구현**한 모든 클래스들에 해당 메소드들을 다 작성해주어야하는 번거로움이 생깁니다.

---

## 전략 패턴을 통한 해결

이를 해결하기 위해 나온 것이 전략 패턴입니다. 전략 패턴은 **알고리즘**(날다, 꽥꽥 소리내다 등)을 독립적인 객체로 **캡슐화**한 뒤, 클라이언트와 **분리**하는 디자인 패턴입니다. 전략패턴을 사용할 경우 클래스를 만들 때 **변화가 필요한** 메소드는 상속하거나 구현하지 않습니다. 대신 각각의 행동을 독립적인 객체로 만든 뒤 이를 필요한 클래스에 **구성으로 추가**합니다.

```java
public interface FlyBehavior {
    public void fly();
}

public interface QuackBehavior {
    public void quack();
}

...

public class Duck {
    FlyBehavior flyBehavior;
    QuackBehavior quackBehavior;

    public void performFly() {
        flyBehavior.fly();
    }

    public void performQuack() {
        quackBehavior.quack();
    }

    public void setFlyBehavior(FlyBehavior fb) {
        flyBehavior = fb;
    }

    public void setQuackBehavior(QuackBehavior qb) {
        quackBehavior = qb;
    }
}
```

위와 같은 방식을 통해 우리는 각각의 행동을 독립적인 객체로 만들어서 필요한 클래스에 구성해 추가할 수 있습니다. 이를 통해 우리는 새로운 행동을 추가하거나, 기존 행동을 변경하는 것이 매우 쉬워집니다. 또한, 각각의 행동을 동적으로 변경하거나 확장할 수 있습니다.

다시 말해, 우리는 전략 패턴을 통해 다음과 같은 장점을 얻을 수 있습니다.

1. 한번 구현한 행동을 다른 클래스에도 쉽게 **재사용**할 수 있습니다.
2. 행동을 **변경**하거나 **확장**하기가 매우 쉬워집니다.
3. 행동을 **동적**으로 변경하는 것도 가능합니다.

---

## 결론

프로그램의 구체적인 **동작**을 **캡슐화**하고 이를 클래스에서 **구성**하는 형태를 우리는 전략 패턴이라고 부릅니다. 이를 통해 우리는 한 번 작성한 코드를 **재사용**하는 장점을 유지하면서도, 새로운 행동을 **추가**하거나 기존 행동을 **동적으로 변경**하는 것이 용이한 프로그램을 작성할 수 있습니다.
