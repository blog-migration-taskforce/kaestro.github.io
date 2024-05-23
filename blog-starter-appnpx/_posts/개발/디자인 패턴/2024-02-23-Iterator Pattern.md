---
layout: default
classes: wide
title: "반복자 패턴"
subtitle: "저녁밥도 팬케이크도 다 단비꺼야"
date: 2024-02-23
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 반복자 패턴을 사용한 해결책
5. 단일 역할 원칙
6. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**반복자 패턴**은 **컬렉션**의 내부 구조를 노출하지 않고 컬렉션의 **모든 요소**에 **접근**할 수 있게 하는 패턴입니다. 이는 항목 내에서 **반복 작업**을 **반복자**로 **캡슐화**해서, 클라이언트가 컬렉션의 내부 구조에 대해 알 필요 없이 컬렉션의 항목을 **순회**할 수 있게 합니다.

반복자 패턴을 통해 각각의 항목에 대한 접근을 하는 기능을 컬렉션에서 **분리**해 반복자 객체가 책임지게 할 수 있습니다. 결과적으로 집합체 인터페이스와 구현이 간단해지고 각자에게 중요한 일만을 처리할 수 있게 됩니다.

head first design patterns는 여러 가지 **음식점 통합**을 해야하는 상황을 이야기합니다. 음식점의 종류에는 팬케이크 하우스, 디너 하우스, 카페가 있고 이들은 각각의 메뉴를 ArrayList, Array, HashMap과 같이 **다른 형태로 관리**하고 있습니다. 이런 상황에서 한 명의 웨이트리스에게 메뉴들을 읽는 다른 방법들을 다 숙지시키고 일을 맡기는 것은 비효율적이고 위험합니다.

이때 반복자 객체를 통한 접근을 사용해서 문제를 해결할 수 있습니다. 웨이트리스는 개별의 객체들을 순회하는 방법들에 대해 인지할 필요 없이 이를 **캡슐화**한 **반복자 객체**를 사용해서 각각의 객체들을 순회할 수 있게 됩니다.

**단일 역할 원칙**(Single Responsibility Principle)은 "**클래스는 하나의 변경 이유만을 가져야 한다**."라는 원칙입니다. 클래스가 여러 가지 이유로 변경될 수록 그 클래스는 여러 가지 이유로 변경될 수 있기 때문에 유지보수가 어려워집니다. 이 때문에 클래스가 바뀌는 부분의 역할이 하나이도록 하자는 원칙입니다.

---

## 요약

1. **반복자 패턴**은 컬렉션의 내부 구조를 노출하지 않고 컬렉션의 **모든 요소에 접근**할 수 있게 하는 패턴입니다.
2. 각각의 항목에 대한 **접근**을 하는 기능을 **캡슐화**를 통해 컬렉션에서 **분리**해 반복자 객체가 책임지게 할 수 있습니다.
3. 집합체 인터페이스와 구현이 간단해지고 각자에게 중요한 일만을 처리할 수 있게 됩니다.
4. **단일 역할 원칙**은 "클래스는 하나의 변경 이유만을 가져야 한다."라는 원칙입니다.

---

## 문제상황

마을의 디너 하우스에서 사업 확장의 일환으로 팬케이크 하우스와 **합병**을 하기로 결정했습니다. 이 합병은, 식사는 훌륭하지만 디저트가 아쉬웠던 약점 보완을 통해 시너지 작용을 해서 더 많은 손님을 유치할 수 있으리라 기대했습니다.

그런데 여기에서 일 할 웨이트리스들 간에서 불만의 목소리가 나왔습니다. "나는 **반대쪽 식당의 메뉴판**을 읽을 수가 없는데요?"

확인해보니, 팬케이크 하우스는 **ArrayList**, 디너 하우스는 **Array**로 메뉴를 관리하고 있었습니다. 이런 상황에서 두 식당을 통합하려면 손님은 자기가 주문하려는 메뉴를 알고 있는 웨이트리스가 누구인지를 알아내든지, 웨이트리스가 두 식당의 메뉴판을 다 숙지하고 있어야 하는 문제가 발생할 것으로 예상됩니다.

이런 상황을 코드로 나타내면 다음과 같습니다.

```java
public class MenuItem {
    String name;
    String description;
    boolean isVegetarian;
    double price;

    public MenuItem(String name, String description, boolean isVegetarian, double price) {
        this.name = name;
        this.description = description;
        this.isVegetarian = isVegetarian;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    ...
}

public class PancakeHouseMenu {
    ArrayList<MenuItem> menuItems;

    public PancakeHouseMenu() {
        menuItems = new ArrayList<MenuItem>();

        addItem("K&B 팬케이크 세트", "스크램블드 에그와 토스트가 곁들여진 팬케이크", true, 2.99);
        addItem("레귤러 팬케이크 세트", "달걀 후라이와 소시지가 곁들여진 팬케이크", false, 2.99);
        addItem("블루베리 팬케이크", "신선한 블루베리와 시럽으로 만든 팬케이크", true, 3.49);
        addItem("와플", "와플, 취향에 따라 블루베리나 딸기를 얹을 수 있습니다.", true, 3.59);
    }

    public void addItem(String name, String description, boolean isVegetarian, double price) {
        MenuItem menuItem = new MenuItem(name, description, isVegetarian, price);
        menuItems.add(menuItem);
    }

    public ArrayList<MenuItem> getMenuItems() {
        return menuItems;
    }

    ...
}

public class DinerMenu {
    static final int MAX_ITEMS = 6;
    int numberOfItems = 0;
    MenuItem[] menuItems;

    public DinerMenu() {
        menuItems = new MenuItem[MAX_ITEMS];

        addItem("채식주의자용 BLT", "통밀 위에 상추, 토마토, 베이컨을 얹은 메뉴", true, 2.99);
        addItem("BLT", "통밀 위에 상추, 토마토, 베이컨을 얹은 메뉴", false, 2.99);
        addItem("오늘의 스프", "감자 샐러드를 곁들인 오늘의 스프", false, 3.29);
        addItem("핫도그", "사워크라우트, 갖은 양념, 양파, 치즈가 곁들여진 핫도그", false, 3.05);
    }

    public void addItem(String name, String description, boolean isVegetarian, double price) {
        MenuItem menuItem = new MenuItem(name, description, isVegetarian, price);
        if (numberOfItems >= MAX_ITEMS) {
            System.err.println("죄송합니다, 메뉴가 꽉 찼습니다. 더 이상 추가할 수 없습니다.");
        } else {
            menuItems[numberOfItems] = menuItem;
            numberOfItems = numberOfItems + 1;
        }
    }

    public MenuItem[] getMenuItems() {
        return menuItems;
    }

    ...
}

public class Waitress {
    PancakeHouseMenu pancakeHouseMenu;
    DinerMenu dinerMenu;

    public Waitress(PancakeHouseMenu pancakeHouseMenu, DinerMenu dinerMenu) {
        this.pancakeHouseMenu = pancakeHouseMenu;
        this.dinerMenu = dinerMenu;
    }

    public void printMenu() {
        ArrayList<MenuItem> breakfastItems = pancakeHouseMenu.getMenuItems();
        MenuItem[] lunchItems = dinerMenu.getMenuItems();

        System.out.println("아침 메뉴");
        for (int i = 0; i < breakfastItems.size(); i++) {
            MenuItem menuItem = breakfastItems.get(i);
            System.out.println(menuItem.getName() + ", ");
            System.out.println(menuItem.getPrice() + " -- ");
            System.out.println(menuItem.getDescription());
        }

        System.out.println("점심 메뉴");
        for (int i = 0; i < lunchItems.length; i++) {
            MenuItem menuItem = lunchItems[i];
            System.out.println(menuItem.getName() + ", ");
            System.out.println(menuItem.getPrice() + " -- ");
            System.out.println(menuItem.getDescription());
        }
    }
}
```

위와 같은 상황을 개선하지 않으면 앞으로 더 많은 음식점을 통합하려는 목표를 가진 주인 입장에서는 심각한 걸림돌이 될 수 있습니다. 새로운 종업원을 교육하는 것도 힘들고, 주문의 절차도 복잡해지기 때문입니다.

여태까지 디자인 패턴을 적용하면서 이런 문제를 해결해왔듯이, **반복**이 되면서 **변하는 부분**을 찾아내고, 이를 **캡슐화**해서 **재사용**할 수 있게 만들어야 합니다.


---

## 반복자 패턴을 사용한 해결책

**반복자 패턴**을 사용하면 위와 같은 문제를 해결할 수 있습니다. 반복자 패턴은 컬렉션의 **내부 구조**를 노출하지 않고 **컬렉션**의 **모든 요소에 접근**할 수 있게 하는 패턴입니다. 이는 항목 내에서 **반복 작업**을 **반복자**로 **캡슐화**해서, 클라이언트가 컬렉션의 내부 구조에 대해 알 필요 없이 컬렉션의 항목을 **순회**할 수 있게 합니다.

비유를 통해 설명하자면 웨이트리스에게 메뉴들을 읽는 방법을 숙지시키는 대신, 이를 정리해 둔 **쪽지**를 주는 것과 같습니다. 이 쪽지는 각각의 식당에 대한 메뉴판을 순회하는 방법을 캡슐화한 반복자 객체입니다.

이를 코드로 나타내면 다음과 같습니다.

```java
public interface Iterator {
    boolean hasNext();
    Object next();
}

public interface Menu {
    Iterator createIterator();
}

public class PancakeMenuIterator implements Iterator {
    ArrayList<MenuItem> items;
    int position = 0;

    public PancakeMenuIterator(ArrayList<MenuItem> items) {
        this.items = items;
    }

    public Object next() {
        MenuItem menuItem = items.get(position);
        position = position + 1;
        return menuItem;
    }

    public boolean hasNext() {
        return position < items.size();
    }
}

public class PancakeHouseMenu implements Menu {
    ...

    public Iterator createIterator() {
        return new PancakeHouseMenuIterator(menuItems);
    }
}

public class Waitress {
    ...

    public void printMenu() {
        Iterator pancakeIterator = pancakeHouseMenu.createIterator();
        Iterator dinerIterator = dinerMenu.createIterator();

        System.out.println("아침 메뉴");
        printMenu(pancakeIterator);
        System.out.println("점심 메뉴");
        printMenu(dinerIterator);
    }

    private void printMenu(Iterator iterator) {
        while (iterator.hasNext()) {
            MenuItem menuItem = (MenuItem) iterator.next();
            System.out.println(menuItem.getName() + ", ");
            System.out.println(menuItem.getPrice() + " -- ");
            System.out.println(menuItem.getDescription());
        }
    }
}
```

이제 더 많은 식당들을 추가하더라도 각각의 웨이트리스들에게 새로운 메뉴판을 읽는 방법을 숙지시키는 대신, 이를 정리해 둔 쪽지를 읽는 방법을 숙지시키는 것만으로도 교육과정을 줄일 수 있습니다.

---

## 단일 역할 원칙

**단일 역할 원칙**(Single Responsibility Principle)은 **"클래스는 하나의 변경 이유만을 가져야 한다."**라는 원칙입니다. 클래스가 여러 가지 이유로 변경될 수록 그 클래스는 여러 가지 이유로 변경될 수 있기 때문에 유지보수가 어려워집니다. 이 때문에 클래스가 **바뀌는 부분**의 **역할**이 **하나**이도록 하자는 원칙입니다.

반복자 패턴을 사용하면 이 원칙을 지킬 수 있습니다. 웨이트리스는 메뉴판을 읽는 방법을 숙지시키는 역할만을 가지고 있고, 반복자 객체는 메뉴판을 순회하는 역할만을 가지고 있습니다. 이렇게 각각의 객체들은 하나의 역할만을 가지고 있기 때문에 단일 역할 원칙을 지킬 수 있습니다.

---

## 결론

**반복자 패턴**은 컬렉션의 **내부 구조**를 노출하지 않고 **컬렉션의 모든 요소에 접근**할 수 있게 하는 패턴입니다. 이는 항목 내에서 반복 작업을 **반복자**로 **캡슐화**해서, 클라이언트가 컬렉션의 내부 구조에 대해 알 필요 없이 컬렉션의 항목을 **순회**할 수 있게 합니다.

이는 마치 여러 가지 **다른 형태의 메뉴판**을 가지고 있는 **음식점의 메뉴**를 통합할 때, 근무할 웨이트리스에게 각각의 메뉴를 숙지하게 하는 것이 아니라 이를 **통합한 쪽지**를 주는 것과 같습니다. 이를 통해 웨이트리스는 각각의 메뉴를 숙지할 필요 없이 쪽지를 통해 메뉴를 **순회**할 수 있게 됩니다.

반복자 패턴을 통해 각각의 항목에 대한 **접근**을 하는 기능을 **캡슐화**를 통해 **컬렉션에서 분리**해 반복자 객체가 책임지게 할 수 있습니다. 결과적으로 집합체 인터페이스와 구현이 간단해지고 각자에게 중요한 일만을 처리할 수 있게 됩니다.

**단일 역할 원칙**(Single Responsibility Principle)은 "**클래스는 하나의 변경 이유만을 가져야 한다.**"라는 원칙입니다. 클래스가 여러 가지 이유로 변경될 수록 그 클래스는 여러 가지 이유로 변경될 수 있기 때문에 유지보수가 어려워집니다. 이 때문에 클래스가 바뀌는 부분의 역할이 하나이도록 하자는 원칙입니다.
