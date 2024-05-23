---
layout: default
classes: wide
title: "템플릿 메소드 패턴"
subtitle: "커피에 홍차를 섞어드셔보세요"
date: 2024-02-21
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 템플릿 메소드 패턴을 사용한 해결책
5. 후크 메소드
6. 할리우드 원칙
7. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**템플릿 메소드 패턴**은 **알고리즘의 골격**을 정의하고, 알고리즘의 일부 단계를 서브클래스로 미루는 패턴입니다. 이는 **알고리즘의 구조**를 변경하지 않고 알고리즘의 **특정 단계**를 서브클래스에서 **재정의**할 수 있게 합니다.

이 과정을 통해 템플릿 메소드 패턴은 알고리즘의 **템플릿(틀)**을 만듭니다. 템플릿이 있기 때문에 서브 클래스는 자기에 맞게 템플릿을 채워넣어 자신만의 알고리즘을 만들 수 있습니다. 이는 코드의 **재사용성**을 높이고 **유지보수성**을 높일 수 있습니다.

head first design patterns는 이에 대한 예시로 **카페인 음료 만들기**를 가져옵니다. 카페인 음료에는 커피와 홍차가 있을 수 있고, 둘은 많은 부분에서 같은 과정을 거치지만 '찻잎'과 '커피 콩'을 넣는 부분이나, '설탕과 우유'와 '레몬'을 추가하는 과정이 다릅니다.

템플릿 메소드 패턴을 통해서 메소드에서 **공유**하는 부분은 상위 클래스에서 구현해 두고, **차이**가 나는 부분은 하위에서 구현하도록 할 수 있습니다.

이 때 **후크 메소드**란 것을 통해 기본적으로는 아무것도 하지 않는 메소드를 만들어 두고, 서브클래스에서 필요에 따라 오버라이드할 수 있게 합니다.

**할리우드 원칙**은 "먼저 연락하지 마세요. 저희가 연락드리겠습니다."라는 뜻으로, **의존성이 부패**하(복잡하기 꼬이)지 않도록 하는 원칙입니다. 이를 통해 저수준 구성요소가 시스템에 접속할 수는 있지만, 언제 어떻게 그 구성 요소를 사용할지는 고수준 구성 요소가 결정합니다.

---

## 요약

1. **템플릿 메소드 패턴**은 **알고리즘의 골격**을 정의하고, 알고리즘의 **일부 단계**를 서브클래스로 미루는 패턴입니다.
2. **템플릿**을 통해 서브 클래스는 자기에 맞게 템플릿을 채워넣어 자신만의 알고리즘을 만들 수 있습니다.
3. **재사용성**을 높이고 **유지보수성**을 높일 수 있습니다.
4. 물 끓이기 - 고정 알고리즘, 찻잎/커피 콩 넣기 - 서브클래스에서 재정의할 수 있는 부분
5. **후크 메소드**는 기본적으로는 아무것도 하지 않는 메소드를 만들어 두고, 서브클래스에서 필요에 따라 오버라이드할 수 있게 합니다.
6. **할리우드 원칙**은 **의존성이 부패**하지 않도록 하는 원칙입니다.

---

## 문제상황

기존에 커피만 판매하던 카페에서 최신 유행에 맞추어 홍차를 판매하기로 결정했습니다. 처음에는 둘의 제조법이 다르기 때문에 별개의 방식으로 관리하고 있었지만, 일을 진행하는 과정에서 과정에서 중복되는 부분이 많은데 이를 따로 관리하는 것이 비효율적이라는 생각을 하게 됐습니다.

이런 상황을 코드로 나타내면 다음과 같습니다.

```java
public abstract class CaffeineBeverage {
    abstract void prepareRecipe(); 
    abstract void boilWater(); 
    abstract void pourInCup();
}

public class Coffee extends CaffeineBeverage {
    @Override
    void prepareRecipe() {
        boilWater();
        brewCoffeeGrinds();
        pourInCup();
        addSugarAndMilk();
    }

    @Override
    void boilWater() {
        System.out.println("물 끓이기");
    }

    void brewCoffeeGrinds() {
        System.out.println("커피를 우려내기");
    }

    @Override
    void pourInCup() {
        System.out.println("컵에 따르기");
    }

    void addSugarAndMilk() {
        System.out.println("설탕과 우유 추가하기");
    }
}

public class Tea extends CaffeineBeverage{
    @Override
    void prepareRecipe() {
        boilWater();
        steepTeaBag();
        pourInCup();
        addLemon();
    }

    @Override
    void boilWater() {
        System.out.println("물 끓이기");
    }

    void steepTeaBag() {
        System.out.println("찻잎을 우려내기");
    }

    @Override
    void pourInCup() {
        System.out.println("컵에 따르기");
    }

    void addLemon() {
        System.out.println("레몬 추가하기");
    }
}
```

---

## 템플릿 메소드 패턴을 사용한 해결책

현재 카페에서 커피와 홍차를 준비하는 과정에서 물 끓이기와 컵에 따르기가 중복되는 것을 볼 수 있습니다. 또 찻잎을 우리는 것과, 레몬을 추가하는 것은 커피를 우리는 것과 우유를 첨가하는 것과 비슷한 행위입니다.

이런 중복성을 해소하기 위해 템플릿 메소드 패턴을 사용할 수 있습니다. 바로 prepareRecipe() 메소드를 추상화하는 것을 통해 말입니다.

```java
public abstract class CaffeineBeverage {
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }

    abstract void brew();
    abstract void addCondiments();

    void boilWater() {
        System.out.println("물 끓이기");
    }

    void pourInCup() {
        System.out.println("컵에 따르기");
    }
}

public class Coffee extends CaffeineBeverage {
    void brew() {
        System.out.println("커피를 우려내기");
    }

    void addCondiments() {
        System.out.println("설탕과 우유 추가하기");
    }
}

public class Tea extends CaffeineBeverage {
    void brew() {
        System.out.println("찻잎을 우려내기");
    }

    void addCondiments() {
        System.out.println("레몬 추가하기");
    }
}
```

기존의 prepareRecipe는 abstract로 선언돼 모든 서브클래스에서 별개로 구현해야했지만, 현재 prepareRecipe는 final로 선언돼 있어 서브클래스에서 오버라이드할 수 없습니다. 이를 통해 prepareRecipe는 고정된 알고리즘을 가지고 있습니다. 하지만 여기에 brew()와 addCondiments()는 추상 메소드로 선언돼 있어 서브클래스에서 구현해서 각자의 알고리즘을 만들 수 있습니다.

이렇게 **템플릿**이라는 **골격** 내에서 **동일한 부분**을 **상위 클래스**에서 구현하고, 일부 **차이**가 나는 부분을 **서브 클래스**에서 구현하는 것을 우리는 **템플릿 메소드**라고 합니다.

---

## 후크 메소드

위에서처럼 모든 서브 클래스마다 다르게 동작을 해야하는 경우도 있지만, 때로는 **아무 동작도 하지 않아야** 되는 경우도 있습니다. 이럴 때 사용하는 것이 바로 **후크 메소드**입니다.

후크 메소드는 기본적으로는 아무것도 하지 않는 메소드를 만들어 두고, 서브클래스에서 필요에 따라 오버라이드할 수 있게 합니다.

예를 들어, 커피나 홍차를 끓이는 것과 달리 우유, 설탕, 레몬을 추가하는 것은 선택사항입니다. 이럴 때 후크 메소드를 사용할 수 있습니다.

```java
public abstract class CaffeineBeverage {
    final void prepareRecipe() {
        ...
        if (customerWantsCondiments()) {
            addCondiments();
        }
    }

    ...
    // 후크 메소드
    boolean customerWantsCondiments() {
        return true;
    }
}

public class Coffee extends CaffeineBeverage {
    ...
    // 후크 메소드 오버라이드
    @Override
    boolean customerWantsCondiments() {
        String answer = getUserInput();
        if (answer.toLowerCase().startsWith("y")) {
            return true;
        } else {
            return false;
        }
    }
}
```

기존에 상위 클래스에서 hooker 메소드인 customerWantsCondiments는 아무것도 하지 않습니다. 그리고 서브 클래스인 커피에서는 유저의 입력에 따라서 첨가물인 설탕과 우유를 추가할지 말지를 결정합니다.

---

## 할리우드 원칙

할리우드 원칙은 "먼저 연락하지 마세요. 저희가 연락드리겠습니다."라는 뜻으로, 의존성이 부패하지 않도록 하는 원칙입니다. 이를 통해 저수준 구성요소가 시스템에 접속할 수는 있지만, 언제 어떻게 그 구성 요소를 사용할지는 고수준 구성 요소가 결정하는 것을 말합니다.

템플릿 메소드 패턴은 이 원칙을 따르는 대표적인 패턴입니다. 상위 클래스에서 하위 클래스를 호출하면서, 하위 클래스에서는 상위 클래스를 호출하지 않습니다.

예를 들어, 스타버즈에서 음료수를 제조하기 시작하면 커피나 홍차를 만들기 위해 물을 끓이고, 컵에 따르는 것은 상위 클래스에서 결정하고, 그 외의 것인 커피를 우려내거나 찻잎을 우려낼 때에만 서브 클래스를 불러냅니다.

이런 것이 할리우드 원칙입니다. 상위 클래스에서 하위 클래스를 호출하면서, 하위 클래스에서는 상위 클래스를 호출하지 않는 것입니다. 이는 일종의 의존성 역전이라고도 할 수 있습니다.

---

## 결론

템플릿 메소드 패턴은 알고리즘의 템플릿(틀)을 만듭니다. 템플릿이 있기 때문에 서브 클래스는 자기에 맞게 템플릿을 채워넣어 자신만의 알고리즘을 만들 수 있습니다. 이는 코드의 **재사용성**을 높이고 **유지보수성**을 높일 수 있습니다.

템플릿 메소드 패턴을 통해 메소드에서 공유하는 부분은 상위 클래스에서 구현해 두고, 차이가 나는 부분은 하위에서 구현하도록 할 수 있습니다.

이 때 후크 메소드란 것을 통해 기본적으로는 아무것도 하지 않는 메소드를 만들어 두고, 서브클래스에서 필요에 따라 오버라이드할 수 있게 합니다.

할리우드 원칙은 "먼저 연락하지 마세요. 저희가 연락드리겠습니다."라는 뜻으로, 의존성이 부패하지 않도록 하는 원칙입니다. 이를 통해 저수준 구성요소가 시스템에 접속할 수는 있지만, 언제 어떻게 그 구성 요소를 사용할지는 고수준 구성 요소가 결정합니다.
