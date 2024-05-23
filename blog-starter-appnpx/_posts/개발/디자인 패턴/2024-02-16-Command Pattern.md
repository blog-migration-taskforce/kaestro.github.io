---
layout: default
classes: wide
title: "커맨드 패턴"
subtitle: "나는 IoT를 지배할 수 있다!"
date: 2024-02-16
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 커맨드 패턴을 통한 해결
5. 매크로 커맨드 패턴 사용하기
6. NoCommand 패턴 사용하기
7. 복잡한 기능 추가하기
8. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**커맨드 패턴**은 **메소드 호출**을 객체로 **캡슐화**하는 패턴입니다. 코드를 호출한 객체는 호출되는 객체가 일을 어떻게 처리하는지 알 필요가 없습니다.

이를 통해 호출하는 객체와 호출되는 객체를 **느슨하게 결합**시키고, **재사용성**을 높일 수 있습니다. 이제 작업을 요청하는 쪽과 작업을 수행하는 쪽을 **분리**할 수 있습니다.

head first design은 이에 대한 예시로 **IoT 리모컨**을 예시로 사용합니다. IoT 리모컨은 다양한 기기를 제어할 수 있는 리모컨입니다. TV, 에어컨, 전구, 창문 등 다양한 기기를 제어할 수 있어야 합니다.

다양한 기기를 제어할 때 각각의 기기를 제어하는 코드를 직접 사용하는 것은 비효율적이고, 유연성이 떨어집니다. 리모콘은 기기들에 명령만 내릴 뿐 어떻게 처리하는지 모르는 것이 좋습니다.

이런 불편을 해소하기 위한 방법 중 하나가 **커맨드 패턴**입니다. 커맨드 패턴을 사용하면 리모컨은 기기들에 명령만 내리고, 기기들은 명령을 받아서 처리하는 방법을 알고 있습니다. 리모컨은 기기들에 명령만 내리면 되기 때문에 유연성이 높아집니다.

---

## 요약

1. 커맨드 패턴은 **메소드 호출을 객체로 캡슐화**하는 패턴입니다.
2. 코드를 호출한 객체는 호출되는 객체가 일을 어떻게 처리하는지 알 필요가 없습니다.
3. 이를 통해 호출하는 객체와 호출되는 객체를 **느슨하게 결합**시키고, **재사용성**을 높일 수 있습니다.
4. 커맨드 패턴은 **커맨드 객체**, **리시버 객체**, **인보커 객체**, **클라이언트 객체**로 구성됩니다.
5. 커맨드 객체는 **실행 메소드**를 가지고 있습니다. 이 메소드는 리시버 객체의 **작업을 수행**합니다.
6. 리시버 객체는 **실제 작업을 수행**하는 객체입니다.
7. 인보커 객체는 **커맨드 객체를 저장**하고 **실행 메소드를 호출**합니다.
8. 클라이언트 객체는 **커맨드 객체를 생성**하고, **인보커 객체에 전달**합니다.
9. **매크로 커맨드 패턴**을 통해 **여러 개의 커맨드**를 묶어서 실행할 수 있습니다.
10. 커맨드 객체 - 키기/끄기, 리시버 객체 - TV/에어컨/전구/창문, 인보커 객체 - 리모컨, 클라이언트 객체 - 사용자
11. **큐, 로그, 스택** 등과 결합해 **취소, 다시 실행**과 같은 복잡한 기능을 추가할 수 있습니다.

---

## 문제상황

IoT 리모컨을 만들어 달라는 요청과 함께 리모컨에서 다룰 수 있어야 하는 다양한 기기들이 주어졌습니다. 이 기기들은 다음과 같습니다.

```java
public class TV {
    public void on() {
        System.out.println("TV를 켭니다.");
    }

    public void off() {
        System.out.println("TV를 끕니다.");
    }

    public void setInputChannel(int channel) {
        System.out.println("채널을 " + channel + "로 변경합니다.");
    }

    public void setVolume(int volume) {
        System.out.println("볼륨을 " + volume + "로 변경합니다.");
    }
}

public class AirConditioner {
    public void on() {
        System.out.println("에어컨을 켭니다.");
    }

    public void off() {
        System.out.println("에어컨을 끕니다.");
    }

    public void setTemperature(int temperature) {
        System.out.println("온도를 " + temperature + "로 변경합니다.");
    }
}

public class Light {
    public void on() {
        System.out.println("전구를 켭니다.");
    }

    public void off() {
        System.out.println("전구를 끕니다.");
    }
}

public class Window {
    public void open() {
        System.out.println("창문을 엽니다.");
    }

    public void close() {
        System.out.println("창문을 닫습니다.");
    }
}
...
```

이런 다양한 클래스들이, 공통적인 인터페이스조차 존재하지 않습니다. 그런데 더 큰 문제는 앞으로도 계속해서 새로운 기기들이 추가될 것이라는 점입니다. 이런 상황에서 어떻게 리모컨을 만들 수 있을까요?

---

## 커맨드 패턴을 통한 해결

이를 해결하기 위해 나온 것이 **커맨드 패턴**입니다. 커맨드 패턴은 **메소드 호출을 객체로 캡슐화**하는 패턴입니다. 이를 통해 호출하는 객체와 호출되는 객체를 **느슨하게 결합**시키고, **재사용성**을 높일 수 있습니다.

**식당에서 주문**을 받는 것을 예시로 들어보겠습니다. 주문을 받는 직원은 주문을 받고, 주문을 요리하는 요리사에게 주문을 전달합니다. 이때 직원은 요리사가 어떻게 요리를 하는지 알 필요가 없습니다. 요리사는 주문을 받아서 요리를 하는 방법을 알고 있습니다.

이 때 **손님**은 **주문**을 하는 **직원**에게 주문을 전달하고, 직원은 **요리사**에게 주문을 전달합니다. 이때 손님은 요리사가 어떻게 요리를 하는지 알 필요가 없습니다. 요리사는 주문을 받아서 요리를 하는 방법을 알고 있습니다.

그리고 이것이 바로 커맨드 패턴이 동작하는 방식입니다. **메소드 호출(음식)**을 사용할 **클라이언트(손님)**는 이를 **객체(주문)**로 **캡슐화**했기 때문에 호출되는 **객체(요리사)**가 일을 어떻게 처리하는지 알 필요가 없습니다.

이를 다른 표현으로는 **클라이언트 객체, 리시버 객체, 커맨드 객체, 인보커 객체**라고도 합니다.

클라이언트 객체는 커맨드 객체를 생성하고, 인보커 객체에 전달합니다. 인보커 객체는 커맨드 객체를 저장하고, 리시버 객체의 작업을 수행하는 실행 메소드를 호출합니다. 커맨드 객체는 실행 메소드를 가지고 있습니다. 이 메소드는 리시버 객체의 작업을 수행합니다. 리시버 객체는 실제 작업을 수행하는 객체입니다.

이런 커맨드 객체를 리모컨에 적용하면 다음과 같이 됩니다.

```java
public interface Command {
    public void execute();
}

public class TVOnCommand implements Command {
    TV tv;

    public TVOnCommand(TV tv) {
        this.tv = tv;
    }

    public void execute() {
        tv.on();
    }
}

public class TVOffCommand implements Command {
    TV tv;

    public TVOffCommand(TV tv) {
        this.tv = tv;
    }

    public void execute() {
        tv.off();
    }
}

// 에어컨, 전구, 창문에 대한 커맨드 객체들도 같은 방식으로 만들어줍니다.
...

public class SimpleRemoteControl {
    Command slot;

    public SimpleRemoteControl() {}

    public void setCommand(Command command) {
        slot = command;
    }

    public void buttonWasPressed() {
        slot.execute();
    }
}
```

위와 같이 커맨드 패턴을 사용하면 리모컨은 기기들에 명령만 내리고, 기기들은 명령을 받아서 처리하는 방법을 알고 있습니다. 리모컨은 기기들에 명령만 내리면 되기 때문에 유연성이 높아집니다.

리모콘이 커맨드를 실행하는 방법은 다음과 같습니다.

```java

SimpleRemoteControl remote = new SimpleRemoteControl();

TV tv = new TV();

TVOnCommand tvOn = new TVOnCommand(tv);
TVOffCommand tvOff = new TVOffCommand(tv);

remote.setCommand(tvOn);
remote.buttonWasPressed(); // TV를 켭니다.

remote.setCommand(tvOff);
remote.buttonWasPressed(); // TV를 끕니다.
```

---

## 매크로 커맨드 패턴 사용하기

커맨드 패턴을 통해 여러 개의 커맨드를 **묶어서 실행**할 수 있습니다. 이를 **매크로 커맨드 패턴**이라고 합니다.

예를 들어 더운 여름날 사용하기 위해 TV를 켜는 커맨드와 에어컨을 켜는 커맨드를 묶어서 하나의 커맨드로 만들 수 있습니다. 이렇게 하나의 커맨드로 묶어서 실행하면 TV를 켜는 커맨드와 에어컨을 켜는 커맨드를 따로 실행하는 것보다 편리합니다.

구현은 다음과 같습니다.

```java
public class MacroCommand implements Command {
    Command[] commands;

    public MacroCommand(Command[] commands) {
        this.commands = commands;
    }

    public void execute() {
        for (int i = 0; i < commands.length; i++) {
            commands[i].execute();
        }
    }
}
```

이렇게 하면 여러 개의 커맨드를 하나의 커맨드로 묶어서 실행할 수 있습니다.

---

## NoCommand 패턴 사용하기

커맨드 패턴은 처음에 객체를 생성할 때 커맨드 객체를 저장하고, 실행 메소드를 호출합니다. 이때 객체를 생성하지 않았을 때의 처리를 위해 **NoCommand 패턴**을 사용할 수 있습니다. NoCommand 패턴을 사용하면 객체를 생성하지 않았을 때의 처리를 쉽게 할 수 있습니다. 

예를 들어 리모컨에 아무런 커맨드를 설정하지 않았을 때의 처리를 위해 다음과 같이 NoCommand 패턴을 사용할 수 있습니다.

```java
public class NoCommand implements Command {
    public void execute() {}
}

public class RemoteControl {
    Command[] onCommands;
    Command[] offCommands;

    public RemoteControl() {
        onCommands = new Command[7];
        offCommands = new Command[7];

        Command noCommand = new NoCommand();
        for (int i = 0; i < 7; i++) {
            onCommands[i] = noCommand;
            offCommands[i] = noCommand;
        }
    }
}
```

NoCommand 패턴을 사용하지 않았을 경우에는 if문을 사용해서 처리해야 했을 것입니다. if (onCommand != null) { ... } else { ... }와 같이 말입니다.

이런 NoCommand 객체는 일종의 **널 객체**입니다. 이 객체는 아무런 동작을 하지 않습니다. 이런 객체를 사용하면 클라이언트 객체는 커맨드 객체가 없을 때의 처리를 신경 쓰지 않아도 됩니다.

---

## 복잡한 기능 추가하기

커맨드 패턴을 **스택, 큐, 로그** 등과 결합해서 **취소, 다시 실행**과 같은 **복잡한 기능**을 추가할 수 있습니다. 대표적으로 여러 작업을 큐에 저장해서 순서대로 실행하거나, 실행한 작업을 스택에 저장해서 취소하거나, 특정 체크 포인트 이후의 모든 행동을 로그에 기록해서 복구 시스템을 구축할 수 있습니다.

---

## 결론

커맨드 패턴은 **메소드 호출을 객체로 캡슐화**하는 디자인 패턴입니다. 이는 호출하는 객체와 호출되는 객체를 **느슨하게 결합**시키고, **재사용성**을 높일 수 있습니다.

**리모컨**을 예시로 들면 사람은 리모컨을 사용해서 TV를 켜고 끄고, 에어컨을 켜고 끄고, 전구를 켜고 끄고, 창문을 열고 닫습니다. 이때 사람은 TV, 에어컨, 전구, 창문이 어떻게 동작하는지 알 필요가 없습니다. 리모컨은 기기들에 명령만 내리면 되기 때문에 유연성이 높아집니다.

커맨드 패턴은 **커맨드 객체**, **리시버 객체**, **인보커 객체**, **클라이언트 객체**로 구성됩니다.

커맨드 객체는 **실행 메소드**를 가지고 있습니다. 리시버 객체는 실제 **작업 수행**을 하는 객체입니다. 인보커 객체는 **커맨드 객체 저장**을 하고, **실행 메소드 호출**을 합니다. 클라이언트 객체는 **커맨드 객체 생성**을 하고, **인보커 객체에 전달**합니다.

커맨드 패턴을 통해 여러 개의 커맨드를 **묶어서 실행**할 수 있습니다. 이를 **매크로 커맨드 패턴**이라고 합니다. 매크로 커맨드 패턴을 통해 적은 노력으로 여러 개의 커맨드를 실행할 수 있습니다.

인보커에서 커맨드 객체를 저장할 때 객체를 생성하지 않았을 때의 처리를 위해 **NoCommand 패턴**을 사용할 수 있습니다. 이런 NoCommand 객체는 일종의 **널 객체**입니다. 이 객체는 아무런 동작을 하지 않습니다. 이런 객체를 사용하면 클라이언트 객체는 커맨드 객체가 없을 때의 처리를 신경 쓰지 않아도 됩니다.

커맨드 패턴을 **스택, 큐, 로그** 등과 결합해서 **취소, 작업 대기 큐, 복구 시스템** 등의 **복잡한 기능**을 추가할 수 있습니다.

이처럼 커맨드 패턴을 통해 **메소드 호출**을 객체로 **캡슐화**하면 호출하는 객체와 호출되는 객체를 **느슨하게 결합**시키고, **재사용성**을 높일 수 있습니다.
