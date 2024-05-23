---
layout: default
classes: wide
title: "컴포지트 패턴"
subtitle: "갈 때 가더라도 디저트 한 대 쯤은 괜찮잖아?"
date: 2024-02-27
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 컴포지트 패턴을 사용한 해결책
5. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**컴포지트 패턴**은 객체들이 복합적으로 구성된 **집합 객체**와 **단일 객체**가 있을 때, 이를 **동일하게 접근**할 수 있는 인터페이스로 구현한 뒤 **트리 구조**로 구성하여 **부분-전체 계층**을 표현하는 패턴입니다. 이를 통해 클라이언트는 개별 객체와 복합 객체를 구분하지 않고 동일하게 다룰 수 있게 됩니다.

head first design patterns에서는 기존의 팬케이크 식당과 디너 식당을 합병하는 상황에서 더 나아간 문제를 제시합니다. 여기에 디저트 식당을 추가로 합병한 뒤에, 이들의 메뉴를 각각 다른 시간대에 독립된 형태로 제공하는 것이 아니라 **복합적인 형태**로 제공하려면 어떻게 해야 할까요?

예를 들어, 프랜차이즈의 오너가 시너지를 위해 디저트 식당을 합병한 경우를 가정해보겠습니다. 회사에서 목표로하는 것은 이 새로운 메뉴들을 별개의 시간에 제공하는 것이 아니라, **기존 메뉴와 함께** 제공하는 것입니다. 디너 식당의 메뉴에 디저트 메뉴 코너를 추가하듯이 말입니다.

**컴포지트 패턴**은 이런 문제에 대한 해결을 제시합니다. 기존에 반복자 패턴은 여러 다른 형태의 객체들을 단일의 반복자라는 인터페이스를 통해 순회할 수 있게 만들어 줬던 것과는 다르게, 컴포지트 패턴을 사용하려면 복합 객체와 단일 객체가 **동일한 인터페이스**를 가지고 있어야 합니다.

새로운 인터페이스를 통해 컴포지트 패턴을 사용하면, 클라이언트는 개별 객체와 복합 객체를 구분하지 않고 동일하게 다룰 수 있으면서 동시에 더 **유연**하게 객체들을 **조합**할 수 있게 됩니다.

---

## 요약

1. **컴포지트 패턴**은 객체들을 **트리 구조**로 구성하여 **부분-전체 계층**을 표현하는 패턴입니다.
2. 클라이언트가 **개별 객체**와 **복합 객체**를 구분하지 않고 **동일**하게 다룰 수 있게 합니다.
3. 컴포지트 패턴을 사용하면 **복합 객체**와 **단일 객체**가 동일한 인터페이스를 가지고 있어야 합니다.
4. 컴포지트 패턴을 통해 더 **유연**하게 객체들을 **조합**할 수 있게 됩니다.

---

## 문제상황

성공적으로 팬케이스 하우스, 디너 하우스를 합병한 프랜차이즈의 오너는 이제 **수평적 확장**에 그치지 않고 **수직적인 확장**에 관심을 가지게 되었습니다. 그리고 그 수단은 바로 디저트 식당을 합병하는 것입니다.

팬케이크 하우스와 디너 하우스의 합병은 서로가 운영하지 않는 시간대를 이용해 시너지를 내는 것이 목적이었습니다. 그러나 케이크 식당은 이와는 다르게, 기존의 메뉴와 함께 제공되어야 합니다. 이를 통해 동일 시간대에 더 많은 수익을 창출하는 것이 이번 합병의 목표입니다.

위 상황을 코드로 나타내면 다음과 같습니다. 여기에 생략된 기존의 팬케이크, 디너 식당의 메뉴를 관리하는 클래스들을 반복자를 통해 작성한 코드는 [반복자 패턴 - 저녁밥도 팬케이크도 다 단비꺼야](https://kaestro.github.io/%EA%B0%9C%EB%B0%9C%EC%9D%B4%EC%95%BC%EA%B8%B0/2024/02/23/Iterator-Pattern.html)를 참고해 주세요.

```java
public class DessertMenu {
    ArrayList<MenuItem> menuItems;

    public DessertMenu() {
        menuItems = new ArrayList<>();

        addItem("케이크", "초콜릿 케이크", true, 3.00);
        addItem("케이크", "바닐라 케이크", true, 3.00);
        addItem("케이크", "딸기 케이크", true, 3.00);
    }

    // 기타 디저트 메뉴를 구성하는 메서드들
    ...
}
```

문제는 위와 같은 메뉴를 관리하는 클래스를 기존의 팬케이크, 디너 식당의 메뉴에 추가하는 것이 복잡하단 것입니다.

해결책 중 하나로는 디저트 메뉴의 항목을 각각 추가할 수도 있습니다. 하지만 만약에 디저트 식당에 새로운 메뉴가 추가하거나 삭제되면 이를 통합한 모든 메뉴들에 해당 작업을 실행해야 합니다. 또 만약 디저트 식당을 매각하게 돼서 메뉴를 삭제해야 한다면 이 또한 골치아픈 일이 될 것입니다.

결국, 이처럼 각각이 다른 형태로 관리되는 메뉴들을 유연하게 통합하는데에는 한계가 있습니다.

---

## 컴포지트 패턴을 사용한 해결책

우선 현재와 같이 각각의 메뉴를 관리하는 클래스들을 동일하게 **메뉴 항목**으로 취급할 수 있는 **인터페이스**를 만들어야 합니다. 이 인터페이스는 메뉴 항목이 가지는 **공통적인 특성**을 정의해야 합니다.

이를 위해 MenuComponent라는 추상 클래스를 만들고, 이 클래스를 상속받아 단일 메뉴 항목을 관리하는 MenuItem과 복합 메뉴 항목을 관리하는 Menu라는 클래스를 만들겠습니다.

코드로 표현하면 다음과 같습니다.

```java
public abstract class MenuComponent {
    public void add(MenuComponent menuComponent) {
        throw new UnsupportedOperationException();
    }

    public void remove(MenuComponent menuComponent) {
        throw new UnsupportedOperationException();
    }

    public MenuComponent getChild(int i) {
        throw new UnsupportedOperationException();
    }

    // 기타 메서드들
}
```

MenuComponent는 단일 메뉴와, 메뉴판이 가지는 공통적인 특성과 그렇지 않은 것이 동시에 정의돼있습니다. 이 때문에 클라이언트는 개별 메뉴와 복합 메뉴를 구분하지 않고 동일하게 다룰 수 있게 됩니다.

대신 개별 메뉴인 MenuItem의 경우에는 add, remove, getChild 메서드를 사용할 수 없게 만들어야 합니다. 이를 위해 UnsupportedOperationException을 던지는 것입니다.

이제 이를 상속받아 단일 메뉴 항목을 관리하는 MenuItem과 복합 메뉴 항목을 관리하는 Menu라는 클래스를 만들겠습니다.

```java
public class MenuItem extends MenuComponent {
    String name;
    String description;
    boolean vegetarian;
    double price;

    public MenuItem(String name, String description, boolean vegetarian, double price) {
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public void print() {
        System.out.print("  " + getName());
        if (isVegetarian()) {
            System.out.print("(v)");
        }
        System.out.println(", " + getPrice());
        System.out.println("     -- " + getDescription());
    }
}
```

```java
public class Menu extends MenuComponent {
    ArrayList<MenuComponent> menuComponents = new ArrayList<>();
    String name;
    String description;

    public Menu(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void add(MenuComponent menuComponent) {
        menuComponents.add(menuComponent);
    }

    public void remove(MenuComponent menuComponent) {
        menuComponents.remove(menuComponent);
    }

    public MenuComponent getChild(int i) {
        return menuComponents.get(i);
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void print() {
        System.out.print("\n" + getName());
        System.out.println(", " + getDescription());
        System.out.println("---------------------");

        Iterator<MenuComponent> iterator = menuComponents.iterator();
        while (iterator.hasNext()) {
            MenuComponent menuComponent = iterator.next();
            menuComponent.print();
        }
    }
}
```

이제 위의 **컴포지트 패턴**을 적용한 메뉴와 메뉴판을 웨이트리스에게 제공하면, 이를 복합적으로 **통합**해서 제공하는 시스템을 구축할 수 있게 됩니다.

이를 코드로 나타내면 다음과 같습니다.

```java
public class TestMenu {
    public static void main(String[] args) {
        MenuComponent pancakeHouseMenu = new Menu("팬케이크 하우스 메뉴", "아침 메뉴");
        MenuComponent dinerMenu = new Menu("디너 메뉴", "점심 메뉴");
        MenuComponent dessertMenu = new Menu("디저트 메뉴", "디저트 메뉴");

        MenuComponent waitress = new Menu("전체 메뉴", "전체 메뉴");

        waitress.add(pancakeHouseMenu);
        waitress.add(dinerMenu);

        dinerMenu.add(desertMenu);
        pancakeHouseMenu.add(desertMenu);

        waitress.print();
    }
}
```

---

## 결론

**복합 객체**와 **단일 객체**를 동일하게 다루어서 **유연**하게 객체들을 **조합**하는 문제를 해결해야하는 경우가 있습니다. 이런 경우에는 양 객체에 **동일한 인터페이스**를 적용하는 **컴포지트 패턴**을 사용할 수 있습니다.

컴포지트 패턴은 객체들을 **트리 구조**로 구성하여 **부분-전체 계층**을 표현하는 패턴입니다. 이를 통해 클라이언트가 **개별 객체**와 복합 객체**를 구분하지 않고 **동일**하게 다룰 수 있습니다.

이는 마치 프랜차이즈 오너가 사업을 **수평적 확장**에서 **수직적 확장**으로 바꾸는 것과 같습니다. 이를 통해 새로운 메뉴들을 별개의 시간에 제공하는 것이 아니라, 기존 메뉴와 함께 제공하는 것입니다.
