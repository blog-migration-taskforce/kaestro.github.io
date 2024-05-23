---
layout: mathjax
classes: wide
title: "Dynamic Programming"
subtitle: "최적해를 구하기 위해, 부분 문제의 최적해를 이용하는 방법"
date: 2024-04-24
categories: Algorithm
---

## Dynamic Programming은 Optimization Problem 해결 방법이다

여러 가지 문제 중에 Dynamic Programming을 사용해서 푸는 문제들은 Optimization Problem을 푸는 경우로 한정됩니다. 그렇다면 Optimization Problem은 무엇을 의미하는 것일까요?

이는 여러개의 [선택 가능한 후보 중에서 최적의 해 또는 최적의 해에 근접한 값을 찾는 문제](https://convex-optimization-for-all.github.io/contents/chapter01/2021/01/07/01_01_optimization_problems/)를 말합니다. 이는 종종 [특정 기능의 최대값 또는 최소값을 찾는 것](https://www.sfu.ca/math-coursenotes/Math%20157%20Course%20Notes/sec_Optimization.html)이 포함됩니다. 예를 들면 이동에 소요되는 최소 시간, 작업 수행에 필요한 최소 비용, 장치에서 생성할 수 있는 최대 전력 등이 있습니다.

---

## Dynamic Programming을 사용하는 문제의 특징

최적값을 문제를 푸는 문제들 중에서도 Dynamic Programming을 통해 해결할 수 있는 문제들은 다음의 두 가지 특징을 가지고 있습니다.

1. **Optimal Substructure** : 문제의 최적해가 부분 문제의 최적해로 구성되어 있습니다.
2. **Overlapping Subproblems** : 부분 문제들이 중복되어 계산되는 경우가 있습니다.

### Optimal Substructure

문제의 최적해가 부분 문제의 최적해로 구성돼 있다는 다음과 같은 의미를 나타냅니다. 우선, 주어진 문제의 최적해를 선택할 수 있다고 가정해 보겠습니다. 이 최적해를 구하는 구조의 특징을 통해 최적해의 값을 정의내릴 때, 부분 문제의 최적해를 사용할 수 있습니다.

예를 들어, Rod-Cutting 문제 즉 막대기를 가장 비싼 가격의 단위 막대기들로 자르는 최적의 해를 구하는 문제를 생각해보겠습니다. 이 문제에서 막대기는 단위 길이별로 가격이 정해져 있습니다.

$$Price_1 = 1, Price_2 = 5, Price_3 = 8$$과 같이 말입니다.

이 때 길이가 4인 막대기를 자르는 최적의 해를 구한다고 가정했을 때, 길이가 5인 막대기를 자르는 최적의 해를 구하는 방법은 다음과 같습니다.

$$Price_5 = \max_{k=1}^{3}(Price_k + Price_{5-k})$$

이처럼 특정 순간의 최적해를 구할 때, 그 최적해를 구성하는 부분 문제의 최적해를 사용해서 표현할 수 있습니다.

### Overlapping Subproblems

이 때 부분 문제들을 구하는 과정 역시 중복되어 계산되는 경우가 있습니다. 방금의 Rod-Cutting 문제를 예시로 들면 Price(5)의 최적해를 구하기 위해서는 Price(4), Price(3), Price(2)의 값을 계산해야합니다. 그리고 이는 다시 {Price(3), Price(2), Price(1)}, {Price(2), Price(1), Price(0)}의 값을 계산해야합니다. 이 때 Price(3)은 Price(2)를 계산할 때도 필요하고 Price(1)을 계산할 때도 필요합니다.

---

## Dynamic Programming의 구현 방법

Dynamic Programming을 구현하는 방법은 요약하자면 다음과 같습니다.

```markdown
1. 최적해를 구하는 경우를 나타내는 함수를 부분 문제의 최적해를 이용해 표현합니다.
2. 부분 문제가 더 나눌 수 없는 경우를 찾아내고, 이를 기저 조건으로 설정합니다.
3. 부분 문제를 구하는 과정에서 중복되는 계산을 피하기 위해, 부분 문제의 최적해를 저장하는 배열을 사용합니다.
```

### Top-Down Approach

Top-Down Approach는 재귀적인(recursive) 방법을 사용하여 문제를 푸는 방법입니다. 예를 들어 rod-cutting 문제를 해결하려 할 때 Price(5)의 값을 구하기 위해 Price(4), Price(3), Price(2)의 값을 구하는 방법입니다. 이는 보통 재귀적인 방법을 사용하여 구현되며 이를 memoization이라고 합니다.

### Bottom-Up Approach

Bottom-Up Approach는 반복적인(iterative) 방법을 사용하여 문제를 푸는 방법입니다. 이는 보통 반복문을 사용하여 작은 값부터 큰 값까지 순차적으로 계산하는 방법입니다. 이를 tabulation이라고 합니다.

문제의 성향에 따라 Top-down approach가 더 적은 연산을 필요로 할 수도 있지만, Bottom-up approach가 더 직관적이고 iterative한 계산 방식을 사용하기 때문에 디버깅에 용이한 등의 장점을 가지고 있습니다.

---

## 참고 자료

- Introduction To algorithms pg.380 ~ 434
- [Convex Optimization for All](https://convex-optimization-for-all.github.io/contents/chapter01/2021/01/07/01_01_optimization_problems/)
- [Optimization Problems](https://www.sfu.ca/math-coursenotes/Math%20157%20Course%20Notes/sec_Optimization.html)
- [tabulation vs memoization](https://www.geeksforgeeks.org/tabulation-vs-memoization/)
