---
layout: default
classes: wide
title: "옵저버 패턴"
subtitle: "어느새 빗물이 내 발목에 고이기 전에 알려줬어야지!"
date: 2024-02-14
categories: 디자인패턴
---

## 목차

1. 개요
2. 요약
3. 문제상황
4. 옵저버 패턴을 통한 해결.
5. Pull 방식의 옵저버 패턴
6. 결론

---

## 개요

본 글은 **head first design patterns** 책을 읽고 정리한 글입니다.

**옵저버 패턴**은 객체의 **상태 변화**를 **관찰**하는 객체를 만들어, 상태 변화가 있을 때마다 이를 **통보**하는 패턴입니다. 이 패턴에서는, **주제**와 **옵저버**가 있습니다. 주제는 상태를 가지고 있으며, 옵저버는 주제의 상태를 관찰하고 있다가 상태가 변화하면 이를 통보받아 처리합니다.

head first design patterns는 이에 대한 예시로 날씨 정보를 제공하는 서비스를 제시해서 설명합니다. 날씨 정보를 제공하는 서비스는 날씨 정보를 제공하는 주제가 되고, 날씨 정보를 받아서 처리하는 서비스는 옵저버가 됩니다.

---

## 요약

1. 옵저버 패턴은 **신문사**와 **구독자**로 비유할 수 있습니다. 신문사는 구독자에게 새로운 뉴스가 나올 때마다 이를 통보합니다. 이때 신문사는 주제가 되고, 구독자는 옵저버가 됩니다.
2. 날씨 정보 서비스 - **주제**, 디스플레이 - **옵저버**
3. 옵저버 패턴은 주제가 통보하는 **push** 방식과 주제에게 상태를 요청하는 **pull** 방식이 있습니다.
4. 상호작용하는 객체들 사이에서 **느슨한** 결합을 사용해서, 객체들을 서로 **독립적**으로 **재사용**할 수 있게 합니다.

---

## 문제 상황

현재 온도, 습도, 기압을 제공하는 날씨 정보 서비스를 만들고 있습니다. 이 서비스는 다음과 같은 요구사항을 가지고 있습니다.

1. 어딘가에서 보내주는 날씨 정보를 받아서, 이를 표시하는 **다양한 디스플레이**를 만들어야 합니다.
2. **날씨 정보**를 제공하는 서비스는 날씨 정보가 **변경**될 때마다 **디스플레이**에게 이를 **통보**해야 합니다.
3. 디스플레이는 날씨 정보가 변경될 때마다, 자신의 디스플레이를 **갱신**해야 합니다.

이를 다음과 같이 구현을 했다고 가정해보겠습니다.

```java
public class WeatherData {
    private float temperature;
    private float humidity;
    private float pressure;

    public void measurementsChanged() {
        float temp = getTemperature();
        float humidity = getHumidity();
        float pressure = getPressure();

        currentConditionsDisplay.update(temp, humidity, pressure);
        statisticsDisplay.update(temp, humidity, pressure);
        forecastDisplay.update(temp, humidity, pressure);
    }

    ...
}
```

위 코드의 문제점은, 새로운 디스플레이 항목이 추가될 때마다 WeatherData 클래스를 수정해야 한다는 것입니다. 또, 실행 중에 디스플레이를 추가하거나 제거하는 것이 불가능합니다. 즉, 바뀌는 부분을 **캡슐화**하지 못했기 때문에 **확장성**이 떨어집니다.

이를 구현하는 과정에서 생길 수 있는 많은 불편을 해소하기 위한 방법 중 하나가 **옵저버 패턴**입니다.

---

## 옵저버 패턴을 통한 해결 (push 방식)

다음과 같이 위의 코드를 옵저버 패턴을 통해 수정해보겠습니다.

```java
public interface Subject {
    public void registerObserver(Observer o);
    public void removeObserver(Observer o);
    public void notifyObservers();
}

public interface Observer {
    public void update(float temp, float humidity, float pressure);
}

public class WeatherData implements Subject {
    private ArrayList<Observer> observers;
    private float temperature;
    private float humidity;
    private float pressure;

    public WeatherData() {
        observers = new ArrayList<Observer>();
    }

    public void registerObserver(Observer o) {
        observers.add(o);
    }

    public void removeObserver(Observer o) {
        int i = observers.indexOf(o);
        if (i >= 0) {
            observers.remove(i);
        }
    }

    public void notifyObservers() {
        for (int i = 0; i < observers.size(); i++) {
            Observer observer = (Observer)observers.get(i);
            observer.update(temperature, humidity, pressure);
        }
    }

    public void measurementsChanged() {
        notifyObservers();
    }

    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }
}

public class CurrentConditionsDisplay implements Observer {
    private float temperature;
    private float humidity;
    private Subject weatherData;

    public CurrentConditionsDisplay(Subject weatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }

    public void update(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        display();
    }

    public void display() {
        System.out.println("Current conditions: " + temperature + "F degrees and " + humidity + "% humidity");
    }
}

...
// 기타 다른 Display 클래스들
```

이제 WeatherData 클래스는 Subject 인터페이스를 구현하고, Observer 인터페이스를 구현하는 디스플레이 클래스들은 이를 구독하고 있습니다. 따라서, WeatherData 클래스는 디스플레이 클래스들을 알 필요가 없어졌습니다. 이것이 바로 **느슨한 결합**입니다.

디스플레이 객체들은 WeatherData 객체에 등록되어 있으며, WeatherData 객체는 디스플레이 객체들에게 상태가 변경될 때마다 이를 통보합니다.

위와 같은 형태로 구현한 Observer를 **Push** 방식이라고 합니다. Push 방식은 주제가 옵저버에게 필요한 데이터를 **직접 전달**합니다.

하지만, 이 방식은 주제가 옵저버에게 필요한 데이터를 모두 전달해야 한다는 단점이 있습니다. 옵저버가 데이터를 받을 필요가 없는 경우에도 데이터를 받게 되기 때문에, **불필요한 데이터**를 받게 됩니다.  이 때문에 만약 주제에 **새로운 데이터**가 추가된다면, 옵저버에게 영향을 주게 됩니다.

예를 들어 현재 WeatherData에 새로운 데이터인 windSpeed가 추가된다면, 모든 옵저버에게 windSpeed를 전달해야 하고 옵저버에는 새로운 변수 windSpeed를 추가해야 합니다. 이는 주제와 옵저버 사이의 **느슨한 결합**을 유지하기 어렵게 만듭니다.

---

## Pull 방식의 옵저버 패턴

이를 해결하기 위한 방법 중 하나가 **Pull** 방식의 옵저버 패턴입니다. 이 방식은 옵저버가 주제에게 필요한 데이터를 **요청**하기 때문에, 주제는 옵저버에게 **필요한 데이터**만 전달하게 됩니다.

다음은 Pull 방식의 옵저버 패턴을 구현한 코드입니다.

```java

...

public interface Observer {
    public void update(Subject s);
}

public class WeatherData implements Subject {

    ...

    public void notifyObservers() {
        for (int i = 0; i < observers.size(); i++) {
            Observer observer = (Observer)observers.get(i);
            observer.update(this);
        }
    }

    ...
}

public class CurrentConditionsDisplay implements Observer {

    ...

    public void update(Subject s) {
        WeatherData weatherData = (WeatherData)s;
        this.temperature = weatherData.getTemperature();
        this.humidity = weatherData.getHumidity();
        display();
    }

    ...
}
```

현재 pull 방식의 옵저버 패턴은 주제가 옵저버에게 필요한 데이터를 전달하지 않고, 옵저버가 주제에게 필요한 데이터를 요청합니다. 이를 통해, 주제는 옵저버에게 필요한 데이터만 전달하게 되며, 불필요한 데이터를 전달하지 않게 됩니다.

pull 방식의 옵저버 패턴은 기존과 다르게, 만약 주제에 새로운 데이터가 추가되어도 옵저버에게 영향을 주지 않습니다. 이는 주제와 옵저버 사이의 느슨한 결합을 유지할 수 있게 합니다.

대신, pull 방식의 옵저버 패턴은 옵저버가 주제에게 필요한 데이터를 요청하기 때문에, 옵저버가 주제에게 **종속적**이게 됩니다. 이는 옵저버가 주제가 구현한 인터페이스를 알아야 하기 때문입니다.

이 때문에 일반적으로, pull 방식의 옵저버 패턴을 사용하는 것이 더 좋습니다.

---

## 결론

옵저버 패턴은 특정 객체의 **상태**가 **변경**될 때, 이를 **관찰**하는 다수의 객체에게 이를 **통보**하는 패턴입니다. 이 패턴을 통해 주제와 옵저버 사이의 **느슨한 결합**을 유지할 수 있게 되며, 객체들을 서로 **독립적**으로 **재사용**할 수 있게 됩니다.
