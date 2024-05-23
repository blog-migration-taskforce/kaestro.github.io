---
layout: default
classes: wide
title: "싱글톤 패턴"
subtitle: "찰리네 초콜릿 보일러는 세계 유일!"
date: 2024-02-17
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 고전적인 싱글톤 패턴을 통한 해결
5. 멀티 쓰레드 환경에서의 문제점
6. 다양한 방법을 통한 해결 - 이중검사 락, 정적인 초기화, Enum
7. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**싱글톤 패턴**은 특정 클래스에 대해 **객체 인스턴스**가 **하나**만 만들어지도록 해 주는 패턴입니다. 이 패턴을 사용하면, 객체 인스턴스가 하나만 만들어지기 때문에 메모리와 같은 **자원을 절약**할 수 있고, 객체 간의 **상태를 공유**해서 전역 변수처럼 사용할 수 있습니다.

head first design은 이에 대한 예시로 **초콜릿 보일러**를 예시로 사용합니다. 초콜릿 보일러는 초콜릿과 우유를 받은 뒤에 끓여서 초코바를 만드는 단계로 넘겨주는 물건입니다. 맛있는 초콜릿을 많이 만들기 위해 무려 **500 갤런(약 1892리터)**의 초콜릿을 만들 수 있는 것을 들였습니다.

이 때문에 이 보일러를 두 개나 유지하는 것은 굉장히 비효율적입니다. 이 거대한 초콜릿 보일러 하나를 동작시키는 것도 힘들 뿐더러, 두 개 이상에서 나온 것을 받아 초코바를 만드는 것도 힘들기 때문입니다.

하지만 한 개의 보일러를 **두 명이 동시에 사용**하려하면 어떤 문제가 생길 수 있을까요? 초콜릿 보일러가 가득 차 있는 상태에서 새로운 재료를 붓는다거나, 끓어넘치고 있는데 온도를 더 올려버리는 등의 문제가 생길 수 있습니다. 이런 문제를 해결하기 위해서는 초콜릿 보일러를 하나만 유지하고, 이를 **공유**해서 사용하는 것이 좋습니다.

이런 식으로 싱글톤 패턴은 **리소스를 절약**하고, 객체 간의 **상태를 공유**하기 위해 사용됩니다. 대신 객체 인스턴스가 하나만 만들어지기 때문에, 이 객체 인스턴스를 공유하는 모든 객체들은 멀티 쓰레드 환경에서는 주의할 필요가 있습니다.

---

## 요약

1. 싱글톤 패턴은 특정 클래스에 대해 **객체 인스턴스**가 **하나만** 만들어지도록 해 주는 패턴입니다.
2. 메모리와 같은 **자원을 절약**할 수 있고, 객체 간의 **상태를 공유**할 수 있습니다.
3. 하나뿐인 인스턴스를 공유하기 때문에 **멀티 쓰레드 환경**에서는 주의해야 합니다.
4. 고전적인 싱글톤 패턴은 **지연 초기화**와 **스레드 안전성**을 보장하지 않습니다.
5. 이를 해결하기 위해 **이중검사 락**을 사용하는 방법이 있습니다.
6. **정적인 초기화**를 사용하는 방법도 있습니다.
7. java에서는 **Enum**을 사용하는 방법이 권장됩니다.

---

## 문제상황

초콜릿 공장에서 초콜릿을 만드는 보일러를 만들고 있습니다. 이 보일러는 초콜릿과 우유를 받은 뒤에 끓여서 초코바를 만드는 단계로 넘겨주는 물건입니다. 이 보일러는 다음과 같이 구현되어 있습니다.

```java
public class ChocolateBoiler {
    private boolean empty;
    private boolean boiled;

    public ChocolateBoiler() {
        empty = true;
        boiled = false;
    }

    public void fill() {
        if (isEmpty()) {
            empty = false;
            boiled = false;
            // 우유/초콜릿을 보일러에 넣는다.
        }
    }

    public void drain() {
        if (!isEmpty() && isBoiled()) {
            // 끓인 우유/초콜릿을 다음 단계로 넘긴다.
            empty = true;
        }
    }

    public void boil() {
        if (!isEmpty() && !isBoiled()) {
            // 우유/초콜릿을 끓인다.
            boiled = true;
        }
    }

    public boolean isEmpty() {
        return empty;
    }

    public boolean isBoiled() {
        return boiled;
    }
}
```

우유나 초콜릿을 채워넣었는지 여부와 우유나 초콜릿을 끓였는지 여부를 세심하게 관리하고는 있지만, 이 **보일러가 여러 개**가 생성되어서 **동시에 사용**될 경우에는 어떻게 될까요? 차있지 않은 보일러를 끓이려고 하거나, 이미 끓인 보일러에 우유나 초콜릿을 채워넣으려고 하는 등의 문제가 생길 수도 있을 것입니다.

이런 문제를 해결하기 위해서는 이 보일러를 **하나만 유지**하고, 이를 **공유**해서 사용하는 것이 좋습니다. 이것이 싱글톤 패턴의 개념입니다. 500 갤런이나 되는 거대한 보일러를 하나만 유지하되, 여기에다가 많은 직원들이 접근해서 우유나 초콜릿을 채워넣고, 끓이고, 다음 단계로 넘기는 것이죠.

---

## 고전적인 싱글톤 패턴을 통한 해결

고전적인 싱글톤 패턴은 다음과 같이 구현됩니다.

```java
public class ChocolateBoiler {
    private static ChocolateBoiler uniqueInstance;

    private ChocolateBoiler() {
        empty = true;
        boiled = false;
    }

    public static ChocolateBoiler getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new ChocolateBoiler();
        }
        return uniqueInstance;
    }
    ...
}
```

고전적인 싱글톤 패턴은 위와 같이 생성자를 **private**으로 선언하고, 유일한 객체 인스턴스를 반환하는 **getInstance** 메소드를 만들어서 객체 인스턴스를 하나만 만들도록 합니다. getInstance 메소드는 객체 인스턴스가 없을 때만 객체 인스턴스를 만들고, 객체 인스턴스가 이미 있을 때는 객체 인스턴스를 반환하도록 합니다.

이렇게 하면 **객체 인스턴스가 하나**만 만들어지기 때문에 메모리와 같은 **자원을 절약**할 수 있고, 객체 인스턴스가 하나만 만들어지기 때문에 객체 간의 **상태를 공유**할 수 있습니다.

---

## 멀티 쓰레드 환경에서의 문제점

다만 이 방법은 **멀티 쓰레드** 환경에서는 문제가 될 수 있습니다.

만약 아직 객체 인스턴스가 **생성되지 않은 상태**에서 **두 개 이상의 쓰레드**가 getInstance 메소드를 호출하게 되면 무슨 일이 일어날까요? 두 개 이상의 쓰레드가 동시에 getInstance 메소드를 호출하게 되면, 두 개 이상의 객체 인스턴스가 생성될 수 있습니다.

초콜릿 공장에 필요한 보일러를 주문하라는 지령서를 실수로 두 명의 직원이 받아서, 거대한 보일러가 두 개나 도착해버린 상황을 상상해 보세요. 우리 공장에는 이런 보일러를 놓을 공간도 없는데 말입니다.

이런 상황을 방지하기 위해서는 멀티 쓰레드 환경에서도 **스레드 안전성**을 보장해야 합니다.

이를 단순하게 해결하는 방법으로는 생성자에 **synchronized** 키워드를 사용하는 방법이 있습니다. 이 방법은 다음과 같이 구현됩니다.

```java
public static synchronized ChocolateBoiler getInstance() {
    if (uniqueInstance == null) {
        uniqueInstance = new ChocolateBoiler();
    }
    return uniqueInstance;
}
```

그런데 synchronized 키워드를 사용하면, **getInstance** 메소드를 호출할 때마다 synchronized 키워드를 사용한 **동기화**를 해야하기 때문에 **성능**이 떨어질 수 있습니다.

대략적으로 **100배** 정도 성능이 떨어진다고 합니다. 이 과정이 **병목(bottleneck)** 지점이 될 경우 프로그램 성능에 크게 영향을 미칠 수 있습니다.

이런 문제를 해결하기 위해서는 여러 가지 방법이 있습니다. 이 중에서는 **이중검사 락**을 사용하는 방법, **정적인 초기화**를 사용하는 방법, **Enum**을 사용하는 방법 등이 있습니다.

---

## 이중검사 락을 사용한 싱글톤 패턴을 통한 해결

**이중검사 락(Double-Checked Locking)**을 사용하는 방법은 다음과 같이 구현됩니다.

```java
public static ChocolateBoiler getInstance() {
    if (uniqueInstance == null) {
        synchronized (ChocolateBoiler.class) {
            if (uniqueInstance == null) {
                uniqueInstance = new ChocolateBoiler();
            }
        }
    }
    return uniqueInstance;
}
```

이렇게 하면 getInstance 메소드를 호출할 때마다 **동기화**를 하지 않고도 **스레드 안전성**을 보장할 수 있습니다. 대부분의 경우에 uiqueInstance는 이미 null이 아닐테니까요.

---

## 정적인 초기화를 사용한 싱글톤 패턴을 통한 해결

**정적인 초기화**를 사용하는 방법도 있습니다. 이 방법은 다음과 같이 구현됩니다.

```java
private static ChocolateBoiler uniqueInstance = new ChocolateBoiler();

public static ChocolateBoiler getInstance() {
    return uniqueInstance;
}
```

대신 이렇게 하면, 프로그램이 시작될 때 바로 객체 인스턴스가 생성되기 때문에 **지연 초기화**가 되지 않습니다. 이런 방법은 **지연 초기화**가 필요하지 않은 경우에 사용하는 것이 좋습니다.

---

## Enum을 사용한 싱글톤 패턴을 통한 해결

java에서는 **Enum**을 사용하는 방법도 있습니다. 이 방법은 다음과 같이 구현됩니다.

```java
public enum ChocolateBoiler {
    INSTANCE;

    private boolean empty;
    private boolean boiled;

    public void fill() {
        if (isEmpty()) {
            empty = false;
            boiled = false;
            // 우유/초콜릿을 보일러에 넣는다.
        }
    }

...
```

위와 같은 방법은 멀티 쓰레드 환경에서 스레드 안정성을 보장하고, 고급 문법인 **직렬화**와 **리플렉션** 등의 문제도 해결할 수 있습니다. 이 때문에 java에서는 이 방법을 사용하는 것을 권장합니다.

---

## 결론

**싱글톤 패턴**은 특정 클래스에 대해 **객체 인스턴스가 하나**만 만들어지도록 해 주는 패턴입니다. 이 패턴을 사용하면, 객체 인스턴스가 하나만 만들어지기 때문에 메모리와 같은 **자원을 절약**할 수 있고, 객체 간의 **상태를 공유**할 수 있습니다.

**멀티 쓰레드 환경**에서는 주의해야 하지만, 이를 해결하기 위한 다양한 방법이 있습니다. 이 중에서는 생성자를 **synchronized**하거나, **이중검사 락**을 사용하는 방법, **정적인 초기화**를 사용하는 방법, **Enum**을 사용하는 방법 등이 있습니다. java에서는 Enum을 사용하는 방법을 권장합니다.
