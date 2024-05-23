---
layout: default
classes: wide
title: "팩토리 패턴"
subtitle: "공장에서 만든 피자는 피자가 아니라고 생각한거야?"
date: 2024-02-15
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 간단한 팩토리 패턴을 통한 해결
5. 팩토리 메소드 패턴을 통한 해결
6. 팩토리 메소드 패턴을 통해 알아보는 의존성 역전 원칙
7. 추상 팩토리 패턴을 통한 해결
8. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**팩토리 패턴**은 **객체의 생성**을 **캡슐화**하는 디자인 패턴입니다. 기존에 객체를 생성하는 코드를 직접 사용하던 것과 달리, 이를 팩토리 클래스에 위임해서 객체를 생성하기 때문에 구상 클래스와 클라이언트 코드를 분리하고 **느슨한 결합**을 유지해서 유연성을 높일 수 있습니다.

head first design은 이에 대한 예시로 **피자 주문 시스템**을 만드는 과정을 제시해서 설명합니다. 피자 주문 시스템에서는 다양한 종류의 피자를 주문할 수 있습니다. 이런 다양한 종류의 피자를 만들 때 각각의 피자를 생성하는 코드를 직접 사용하는 것은 비효율적이고, 유연성이 떨어집니다. 이런 불편을 해소하기 위한 방법 중 하나가 **팩토리 패턴**입니다.

---

## 요약

* 팩토리 패턴은 **객체의 생성을 캡슐화**하는 디자인 패턴입니다.
* 객체를 생성하는 코드를 직접 사용하는 것이 아니라, 팩토리 클래스에 **위임**해서 객체를 생성합니다.
* 이를 통해 구상 클래스와 클라이언트 코드를 분리하고 **느슨한 결합**을 유지해서 유연성을 높일 수 있습니다.
* 팩토리 패턴은 객체 생성을 위임하는 방식에 따라 **간단 팩토리 패턴**, **팩토리 메소드 패턴**, **추상 팩토리 패턴**으로 나뉩니다.
* 팩토리 - 피자/재료 공장, 제품 - 피자/재료

---

## 문제상황

피자 주문 시스템을 만들고 있다고 가정해겠습니다. 기존에 피자 주문 시스템에서 사용하던 **피자 클래스**는 다음과 같습니다.

```java
public abstract class Pizza {
    String name;
    String dough;
    String sauce;
    List<String> toppings = new ArrayList<>();

    public String getName() {
        return name;
    }

    public Pizza orderPizza(String type) {
        Pizza pizza = null;

        if (type.equals("cheese")) {
            pizza = new CheesePizza();
        } else if (type.equals("greek")) {
            pizza = new GreekPizza();
        } else if (type.equals("pepperoni")) {
            pizza = new PepperoniPizza();
        }

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }

    public void prepare() {
        System.out.println("Preparing " + name);
    }

    public void bake() {
        System.out.println("Baking " + name);
    }

    public void cut() {
        System.out.println("Cutting " + name);
    }

    public void box() {
        System.out.println("Boxing " + name);
    }
}
...
```

위의 코드는 피자 주문 시스템에서 사용하는 피자 클래스입니다. 이 피자 클래스는 다양한 종류의 피자를 생성할 수 있습니다. 하지만 이런 식으로 **orderPizza 메소드**를 통해 **피자(인스턴스)**를 만드는 것은 **구상 클래스에 의존**하기 때문에 유연성이 떨어져서 문제가 있습니다.

만약에 새로운 종류의 피자를 추가하고 싶다면 어떻게 해야 할까요? 또는 피자의 재료를 추가하거나, 기존의 피자를 수정하거나, 동일한 이름의 다양한 피자를 만들고 싶다면 어떻게 해야 할까요?

그럴 때마다 다음과 같은 방식으로 **orderPizza** 메소드를 수정해야 할 것입니다.

```java
public Pizza orderPizza(String type) {
    Pizza pizza = null;

    if (type.equals("cheese")) {
        pizza = new CheesePizza();
    } else if (type.equals("greek")) {
        pizza = new GreekPizza();
    } else if (type.equals("pepperoni")) {
        pizza = new PepperoniPizza();
    // 새로운 3 종류의 피자 추가
    } else if (type.equals("veggie")) {
        pizza = new VeggiePizza();
    } else if (type.equals("clam")) {
        pizza = new ClamPizza();
    } else if (type.equals("calm")) {
        pizza = new CalmPizza();
    }

    ...
}
```

이 때 바뀌는 부분이 새로운 피자를 추가하는 부분이기 때문에, 이를 **캡슐화**하는 것이 좋습니다. 이런 **객체 생성** 부분을 캡슐화하는 것이 바로 **팩토리 패턴**입니다.

---

## 간단한 팩토리를 통한 해결

**간단한 팩토리**는 **객체 생성을 전담**하는 클래스를 만들어서 객체 생성을 **위임**하는 방식입니다. 이를 통해 객체 생성을 캡슐화하고, 클라이언트 코드와 구상 클래스를 **분리**할 수 있습니다.

head first design pattern에서는 이를 디자인 패턴이 아니라 프로그래밍에서 자주 사용하는 관용구라고 설명합니다. 이는 디자인 패턴의 정의가 인터페이스 구현을 통한 객체의 행동을 캡슐화하는 것이기 때문입니다.

그렇다 하더라도 간단한 팩토리를 사용해서 객체 생성을 캡슐화하는 것은 팩토리 패턴의 기본이 되는 개념이기 때문에 이를 통해 팩토리 패턴을 이해할 수 있습니다.

위의 피자 주문 시스템을 간단한 팩토리를 통해 해결해보겠습니다.

```java
public class SimplePizzaFactory {
    public Pizza createPizza(String type) {
        Pizza pizza = null;

        if (type.equals("cheese")) {
            pizza = new CheesePizza();
        } else if (type.equals("greek")) {
            pizza = new GreekPizza();
        } else if (type.equals("pepperoni")) {
            pizza = new PepperoniPizza();
        } else if (type.equals("veggie")) {
            pizza = new VeggiePizza();
        } else if (type.equals("clam")) {
            pizza = new ClamPizza();
        } else if (type.equals("calm")) {
            pizza = new CalmPizza();
        }

        return pizza;
    }
}

public class PizzaStore {
    SimplePizzaFactory factory;

    public PizzaStore(SimplePizzaFactory factory) {
        this.factory = factory;
    }

    public Pizza orderPizza(String type) {
        Pizza pizza;

        pizza = factory.createPizza(type);

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }
}
```

간단한 팩토리를 통해 객체 생성을 캡슐화했습니다. 이를 통해 피자 주문 시스템의 클라이언트 코드와 구상 클래스를 분리할 수 있습니다.

단순히 객체 생성을 위임했을 뿐으로 보이지만 이를 사용하는 클라이언트가 매우 많을 수도 있고, 서브 클래스로 PizzaShopMenu, NYPizzaFactory, ChicagoPizzaFactory 등을 만들 수 있습니다.

또 간단한 팩토리 클래스로 객체 생성을 캡슐화하면 이를 사용하는 다양한 클라이언트에서 일일이 객체 생성 코드를 작성하지 않아도 되기 때문에 **유지보수성**이 높아집니다.

이런 식으로 객체 생성을 캡슐화해서 유연성을 높이는 것이 바로 **팩토리 패턴**의 기본 개념입니다.

---

## 팩토리 메소드 패턴을 통한 해결

그런데 만약에 피자 주문 시스템을 **확장**해서 각 지역마다 다른 종류의 피자를 만들고 싶다면 어떻게 해야 할까요? 예를 들어 뉴욕 지역에서는 뉴욕 피자를, 시카고 지역에서는 시카고 피자를 만들고 싶다면 어떻게 해야 할까요?

이런 경우에 **팩토리 메소드 패턴**을 사용할 수 있습니다. 기본 팩토리 패턴에서는 객체 생성을 위임하는 클래스를 만들어서 객체 생성을 캡슐화했다면, 팩토리 메소드 패턴에서는 객체 생성하는 메소드를 **추상화**해서 객체 생성을 추가적으로 캡슐화합니다.

예를 들어 다음과 같이 **createPizza** 메소드를 추상화해서 팩토리 메소드 패턴을 사용할 수 있습니다.

```java
public abstract class PizzaStore {
    public Pizza orderPizza(String type) {
        Pizza pizza;

        pizza = createPizza(type);

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }

    abstract Pizza createPizza(String type);
}

public class NYPizzaStore extends PizzaStore {
    Pizza createPizza(String type) {
        Pizza pizza = null;
        if (type.equals("cheese")) {
            pizza = new NYStyleCheesePizza();
        } else if (type.equals("greek")) {
            pizza = new NYStyleGreekPizza();
        } else if (type.equals("pepperoni")) {
            pizza = new NYStylePepperoniPizza();
        }
        return pizza;
    }
}

public class ChicagoPizzaStore extends PizzaStore {
    Pizza createPizza(String type) {
        Pizza pizza = null;
        if (type.equals("cheese")) {
            pizza = new ChicagoStyleCheesePizza();
        } else if (type.equals("greek")) {
            pizza = new ChicagoStyleGreekPizza();
        } else if (type.equals("pepperoni")) {
            pizza = new ChicagoStylePepperoniPizza();
        }
        return pizza;
    }
}
```

이처럼 팩토리 메소드 패턴은 createPizza 메소드를 추상화해서 객체 생성을 캡슐화합니다. 이를 통해 팩토리 메소드 패턴은 객체 생성을 위임하는 과정을 추상화해서 기본 팩토리 패턴보다 더 유연하게 객체 생성을 관리할 수 있습니다.

이 때문에 팩토리 메소드 패턴을 정의할 때, 객체를 생성할 때 필요한 **인터페이스**를 만든 뒤 어떤 클래스 **인스턴스**를 만들지는 **서브 클래스**에서 결정하도록 맡기게 됩니다. 이것은 **의존성 역전 원칙**을 따르는 것을 통해 **느슨한 결합**을 유지하는 하나의 방법입니다.

이 때 PizzaStore를 **Creator(생산자)** 클래스, createPizza를 **팩토리 메소드**, Pizza를 **Product(제품)** 클래스라고 합니다.

---

## 팩토리 메소드 패턴을 통해 알아보는 의존성 역전 원칙

위의 팩토리 메소드 패턴을 통해 알 수 있는 것 중 하나가 바로 **의존성 역전 원칙**입니다. 이 원칙은 모듈을 작성할 때 **추상화에 의존**하도록 만들고, **구체화에 의존**하지 않도록 하는 원칙을 말합니다. 다른 말로는, **상위 수준 모듈**은 **하위 수준 모듈**에 의존해서는 안되며, 둘 다 추상화에 의존해야 한다고도 합니다.

기존에 피자 주문 시스템에서는 PizzaStore 클래스가 구상 클래스에 의존하고 있었습니다. 이런 식으로 객체 생성을 위임하는 클래스가 구상 클래스에 의존하게 되면 유연성이 떨어지게 됩니다.

그런데 팩토리 메소드 패턴을 통해 PizzaStore를 구현할 때는 이를 우선 추상화해서 객체 생성을 위임하는 클래스가 추상 클래스에 의존하도록 만들었습니다. 이를 통해 객체 생성을 위임하는 클래스가 구상 클래스에 의존하지 않도록 만들었습니다.

### 의존성 역전 원칙을 지키는 방법

1. 변수를 사용할 때는 **구상 클래스**가 아닌 **추상 클래스**나 **인터페이스**를 사용합니다.
2. 구상 클래스에서 **유도된 클래스**를 만들지 않습니다.
3. 베이스 클래스에서 이미 구현된 **메소드 오버라이드**를 하지 않습니다.

---

## 추상 팩토리 패턴을 통한 해결

여태까지 상황에서 더 나아가, 피자 주문 시스템에서 사용하는 원재료 군에 따른 **제품군**을 만들려면 기존의 방식으로는 어떻게 해야 할까요? 예를 들어 뉴욕 지역에서는 뉴욕 피자와 뉴욕 원재료를, 시카고 지역에서는 시카고 피자와 시카고 원재료를 만들고 싶다면요?

이런 경우에 **추상 팩토리 패턴**을 사용할 수 있습니다. **기본 팩토리 패턴**에서는 객체 생성을 위임하는 클래스를 만들어서 객체 생성을 캡슐화했고, **팩토리 메소드 패턴**에서는 객체 생성을 위임하는 메소드를 추상화해서 객체 생성을 캡슐화했습니다.

추상 팩토리 패턴에서는 객체 생성을 위임하는 **클래스를 인터페이스로 추상화**해서 객체 생성을 캡슐화합니다. 이를 통해 추상 팩토리 패턴은 구상 클래스에 의존하지 않고도 서로 연관되거나 의존적인 객체로 이루어진 제품군을 생성하는 인터페이스를 제공할 수 있습니다. 구상 클래스는 서브 클래스에서 만듭니다.

예를 들어 다음과 같이 **PizzaIngredientFactory** 인터페이스를 추상화해서 추상 팩토리 패턴을 사용할 수 있습니다.

```java
public interface PizzaIngredientFactory {
    public Dough createDough();
    public Sauce createSauce();
    public Cheese createCheese();
    public Veggies[] createVeggies();
    public Pepperoni createPepperoni();
    public Clams createClam();
}

public class NYPizzaIngredientFactory implements PizzaIngredientFactory {
    ...
}

public class ChicagoPizzaIngredientFactory implements PizzaIngredientFactory {
    ...
}
```

위와 같이 추상 팩토리 패턴을 사용해서 **객체 생성을 위임**하는 클래스를 **인터페이스**로 **추상화**했습니다. 이를 통해 추상 팩토리 패턴은 객체 생성을 위임하는 클래스가 구상 클래스에 의존하지 않고도 서로 연관되거나 의존적인 객체로 이루어진 제품군을 생성하는 인터페이스를 제공할 수 있습니다.

---

## 결론

팩토리 패턴은 **객체의 생성**을 **캡슐화**하는 디자인 패턴입니다. 이는 공장에서 물건을 만드는 것처럼 클라이언트가 **팩토리 클래스에 위임**해서 객체를 생성하기 때문에, 구상 클래스와 클라이언트 코드를 분리하고 느슨한 결합을 유지해서 유연성을 높일 수 있습니다. 사용자는 물건을 만드는 공장에 요청을 할 뿐, 어떻게 만드는지는 알 필요가 없습니다.

팩토리 패턴을 통해 객체 생성을 캡슐화해서 사용하는 모듈은 **구상 클래스**에 의존하지 않고, **추상화된 인터페이스**에 의존하게 됩니다. 이는 **의존성 역전 원칙**을 따르는 것을 통해 **느슨한 결합**을 유지하는 하나의 방법입니다.

팩토리 패턴을 통해 객체 생성을 캡슐화하면 이를 사용하는 다양한 클라이언트에서 일일이 객체 생성 코드를 작성하지 않아도 되기 때문에 **유지보수성**이 높아집니다.

팩토리 패턴을 구현하는 방식에 따라 **간단 팩토리 패턴**, **팩토리 메소드 패턴**, **추상 팩토리 패턴**으로 나뉩니다. 이를 통해 객체 생성을 위임하는 방식에 따라 객체 생성을 캡슐화하는 방법을 이해할 수 있습니다.
