---
layout: series_mathjax
classes: wide
title: "Bellman-ford algorithm"
subtitle: "single-source shortest path algorithm(2)"
date: 2024-05-07
categories: Algorithm
series: "single-source shortest path algorithm"
seriesIndex: 2
---

### 목차

- [1. Introduction](#1-introduction)
- [2. Algorithm by pseudocode](#2-algorithm-by-pseudocode)
- [Algorithm by python](#algorithm-by-python)
- [Time complexity](#time-complexity)
- [Reference](#reference)

---

## 1. Introduction

`벨만-포드 알고리즘`은 `단일 출발점 최단 경로 알고리즘` 중 하나로, `음수 가중치`를 가진 간선이
 포함된 그래프에서도 사용할 수 있다. 음수 가중치를 가진 간선이 포함된 그래프에서도 사용할
 수 있다는 장점이 있으며, 음수 사이클이 존재하는 경우 false/error를 반환하는 방식으로
 음수 사이클을 탐지할 수 있다.

---

## 2. Algorithm by pseudocode

벨만-포드 알고리즘은 다음과 같은 방식으로 동작한다.

```plaintext
BELLMAN-FORD(G, w, s)
1  INITIALIZE-SINGLE-SOURCE(G, s)  // 모든 정점의 거리 값을 무한대로 초기화하고, 시작점의 거리 값을 0으로 설정합니다.
2  for i = 1 to |V[G]| - 1  // 그래프의 정점 수 - 1만큼 반복합니다.
3      for each edge (u, v) in E[G]  // 그래프의 모든 간선에 대해
4          RELAX(u, v, w)  // u를 통해 v로 가는 경로가 더 짧은지 확인하고, 더 짧다면 v의 거리 값을 갱신합니다.
5  for each edge (u, v) in E[G]  // 그래프의 모든 간선에 대해
6      if d[v] > d[u] + w(u, v)  // u를 통해 v로 가는 경로가 v의 현재 거리 값보다 작다면
7          return false  // 음의 사이클이 존재하므로 false를 반환합니다.
8  return true  // 모든 간선에 대해 음의 사이클이 없다면 true를 반환합니다.
```

`BELLMAN-FORD(G, w, s)`: 그래프 `G`와 가중치 함수 `w`, 시작 정점 `s`를 입력으로 받아 최단 경로를 계산한다.

이 때 사용하는 자료구조는 다음과 같다.

- `d`: 정점 `s`로부터 정점 `v`까지의 최단 거리를 저장하는 배열
- V[G]: 그래프 `G`의 정점 집합
- E[G]: 그래프 `G`의 간선 집합

---

## Algorithm by python

```python
def bellman_ford(graph, start):
    distance, predecessor = dict(), dict()
    # 각 노드의 거리와 선행 노드를 초기화합니다
    for node in graph:
        distance[node], predecessor[node] = float('inf'), None
    distance[start] = 0

    # 간선들에 대해 반복적으로 거리를 갱신(relax)합니다
    for _ in range(len(graph) - 1):
        for node in graph:
            for neighbour in graph[node]:
                if distance[neighbour] > distance[node] + graph[node][neighbour]:
                    distance[neighbour], predecessor[neighbour] = distance[node] + graph[node][neighbour], node

    # 음수 사이클을 확인합니다
    for node in graph:
        for neighbour in graph[node]:
            assert distance[neighbour] <= distance[node] + graph[node][neighbour]

    return distance, predecessor
```

---

## Time complexity

벨만-포드 알고리즘의 시간 복잡도는 $O(VE)$이다. 이는 모든 간선에 대해 최단 거리를 갱신하는
 과정을 $|V| - 1$번 반복하기 때문이다.

---

## Reference

- [Bellman-Ford algorithm - Wikipedia](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
- [Introduction to Algorithms, 3rd Edition](https://mitpress.mit.edu/books/introduction-algorithms-third-edition)
