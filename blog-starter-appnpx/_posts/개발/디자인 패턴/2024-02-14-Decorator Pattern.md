---
layout: default
classes: wide
title: "데코레이터 패턴"
subtitle: "싸구려 커피를 마시기 전에 우유를 넣으세요"
date: 2024-02-14
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 데코레이터 패턴을 통한 해결
5. OCP(Open-Closed Principle)
6. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

데코레이터 패턴은 **객체의 행동**을 **동적**으로 **확장**할 수 있게 해주는 디자인 패턴입니다. 이를 통해 상속을 통한 확장의 문제점을 해결할 수 있습니다.

head first design은 이에 대한 예시로 커피의 구현 기획이 변화하는 과정을 제시해서 설명합니다. 커피숍에서 판매하는 커피의 **종류**와 **첨가물**을 추가하는 것이 요구될 수 있습니다. 이런 다양한 요구사항을 상속을 통해 구현하는 것은 모든 서브 클래스를 만들어야 하는 등의 이유 때문에 불편하고, 비효율적입니다. 이런 불편을 해소하기 위한 방법 중 하나가 **데코레이터 패턴**입니다.

---

## 요약

* 데코레이터 패턴은 객체의 **행동**을 **동적**으로 **확장**할 수 있게 해주는 디자인 패턴입니다.
* 음료에 들어가는 **첨가물**들을 **데코레이터**로 구현합니다.
* **서브 클래스**를 만드는 대신, **데코레이터**를 사용하면 런타임에 행동을 확장할 수 있습니다.

---

## 문제상황

커피 샵 시스템을 만들고 있다고 가정해겠습니다. 기존에 커피 숍의 주문 시스템에서 사용하던 음료 클래스는 다음과 같습니다.

```java
public abstract class Beverage {
    String description = "제목 없음";

    public String getDescription() {
        return description;
    }

    public abstract double cost();
}

public class Espresso extends Beverage {
    public Espresso() {
        description = "에스프레소";
    }

    public double cost() {
        return 1.99;
    }
}

public class HouseBlend extends Beverage {
    public HouseBlend() {
        description = "하우스 블렌드 커피";
    }

    public double cost() {
        return .89;
    }
}

...
```

이런 구현 방식은 새로운 **첨가물**을 **추가**하는 것이 어렵다는 문제가 있습니다. 첨가물이란 모카나 우유와 같이 음료에 추가해서 맛을 바꾸는 것들을 말합니다. 예를 들어 모카라는 첨가물을 제공하려면 어떻게 해야할까요? 우리는 다음과 같은 class를 추가해야할 것입니다.

```java
public class EspressoWithMocha extends Beverage {
    ...
}
```

만약 음료의 종류가 10가지였다면 모카를 첨가하게 될 음료에 대해 최대 10가지의 서브 클래스를 만들어야 합니다. 이는 매우 비효율적입니다.

그런데 여기에 더해 모카가 아닌 새로운 첨가물이 추가된다면 어떻게 해야할까요? 심지어 모카와 함께 들어갈 수 있는 우유와 같은 첨가물이라면요? 이런 경우에는 **조합의 수**가 무수히 많아질 수 있습니다.

```java

public class EspressoWithMilk extends Beverage {
    ...
}

public class EspressoWithMochaAndMilk extends Beverage {
    ...
}

public class HouseBlendWithMochaAndMilk extends Beverage {
    ...
}

...

```

이런 식으로 **서브 클래스**를 만드는 것은 매우 비효율적입니다. 이를 해결하기 위해 등장한 것이 바로 **데코레이터 패턴**입니다.

---

## 데코레이터 패턴을 통한 해결

데코레이터 패턴은 커피에 다양한 첨가물을 추가할 수 있는 상황처럼, 객체에 **다양한 추가 요소**를 **동적으로 추가**할 필요가 있을 때 사용할 수 있는 패턴입니다.

데코레이터 패턴은 일종의 **투명한 래퍼**를 만드는 것과 같습니다. 이 래퍼는 자신이 감싸고 있는 객체와 같은 인터페이스를 구현합니다.

데코레이터 패턴을 통해 위의 커피 숍 문제를 다음과 같이 해결할 수 있습니다.

```java
public abstract class Beverage {
    String description = "제목 없음";

    public String getDescription() {
        return description;
    }

    public abstract double cost();
}

public abstract class CondimentDecorator extends Beverage {
    Beverage beverage;
    public abstract String getDescription();
}
```

위의 데코레이터 패턴이 존재하는 상태에서 다음과 같은 서브 클래스들이 구현돼있다 가정해보겠습니다.

1. **Beverage**
    * Espresso
    * HouseBlend
    * DarkRoast

2. **CondimentDecorator**
    * Mocha
    * Soy
    * Whip
    * Milk

이제 우리는 Espresso에 Mocha와 Milk를 추가하는 것을 다음과 같이 구현할 수 있습니다.

```java
Beverage beverage = new Espresso();
beverage = new Mocha(beverage);
beverage = new Milk(beverage);

System.out.println(beverage.getDescription() + " $" + beverage.cost());
```

위의 방식은 기존에 서브 클래스를 만드는 방식과는 다르게 수많은 조합을 일일이 구현할 필요가 없습니다. 또한, 런타임에 행동을 확장할 수 있게 되었습니다.

---

## OCP(Open-Closed Principle)

이처럼 우리는 데코레이터 패턴을 통해 음료에 다양한 첨가물을 추가하더라도 새로운 행동을 추가하는 서브 클래스를 만들 필요가 없어졌습니다. 또한, 다양한 객체들을 조합할 수 있게 되었습니다.

이런 식으로 객체의 행동을 **확장할 수 있으면서, 변화에는 닫혀있는 특징**을 우리는 **OCP(Open-Closed Principle)**라고 합니다.

---

## 결론

데코레이터 패턴은 **객체의 행동을 동적으로 확장**할 수 있게 해주는 디자인 패턴입니다. 기존처럼 상속을 통해 확장을 하려할 경우에는 변화하는 부분에 대한 **캡슐화**가 어렵고, 불필요한 서브 클래스의 생성이 발생할 수 있습니다.

데코레이터 패턴은 기존의 **객체를 장식(decorate)**하는 방식으로 객체의 행동을 확장합니다. 이를 통해 객체의 행동을 동적으로 확장할 수 있으면서, **OCP**를 준수할 수 있게 됩니다.

대신 데코레이터 패턴을 사용하기 위해 다양한 객체를 조합하는 것은 관리하기 어려울 수 있습니다. 이를 해결하기 위해 **팩토리 패턴**과 같은 디자인 패턴을 함께 사용할 수 있습니다.
